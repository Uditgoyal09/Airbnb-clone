from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from backend import models, schemas
import json
import datetime

# ─── Users ───────────────────────────────────────────────────────────────────

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        email=user.email,
        is_host=user.is_host,
        avatar_url=user.avatar_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ─── Listings ─────────────────────────────────────────────────────────────────

def get_listings(db: Session, skip: int = 0, limit: int = 100,
                 location: str = None, min_price: float = None,
                 max_price: float = None, property_type: str = None,
                 guests: int = None, category: str = None, host_id: int = None):
    query = db.query(models.Listing)
    if location:
        query = query.filter(models.Listing.location.ilike(f"%{location}%"))
    if min_price is not None:
        query = query.filter(models.Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(models.Listing.price_per_night <= max_price)
    if property_type:
        query = query.filter(models.Listing.property_type.ilike(f"%{property_type}%"))
    if guests is not None:
        query = query.filter(models.Listing.max_guests >= guests)
    if category:
        query = query.filter(models.Listing.category == category)
    if host_id is not None:
        query = query.filter(models.Listing.host_id == host_id)
    return query.offset(skip).limit(limit).all()

def get_listing(db: Session, listing_id: int):
    return db.query(models.Listing).filter(models.Listing.id == listing_id).first()

def create_listing(db: Session, listing: schemas.ListingCreate):
    db_listing = models.Listing(**listing.dict())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def update_listing(db: Session, listing_id: int, listing: schemas.ListingCreate):
    db_listing = get_listing(db, listing_id)
    if db_listing:
        for key, value in listing.dict().items():
            setattr(db_listing, key, value)
        db.commit()
        db.refresh(db_listing)
    return db_listing

def delete_listing(db: Session, listing_id: int):
    db_listing = get_listing(db, listing_id)
    if db_listing:
        db.delete(db_listing)
        db.commit()
    return db_listing

# ─── Bookings ─────────────────────────────────────────────────────────────────

def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Booking).offset(skip).limit(limit).all()

def get_bookings_for_guest(db: Session, guest_id: int, skip: int = 0, limit: int = 100):
    return (db.query(models.Booking)
              .filter(models.Booking.guest_id == guest_id)
              .order_by(models.Booking.created_at.desc())
              .offset(skip).limit(limit).all())

def get_bookings_for_listing(db: Session, listing_id: int):
    return db.query(models.Booking).filter(models.Booking.listing_id == listing_id).all()

def check_date_overlap(db: Session, listing_id: int, check_in: datetime.date, check_out: datetime.date, exclude_booking_id: int = None):
    """Returns True if dates overlap with existing bookings."""
    query = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status != "cancelled",
        and_(
            models.Booking.check_in < check_out,
            models.Booking.check_out > check_in
        )
    )
    if exclude_booking_id:
        query = query.filter(models.Booking.id != exclude_booking_id)
    return query.first() is not None

def create_booking(db: Session, booking: schemas.BookingCreate):
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def cancel_booking(db: Session, booking_id: int):
    db_booking = get_booking(db, booking_id)
    if db_booking:
        db_booking.status = "cancelled"
        db.commit()
        db.refresh(db_booking)
    return db_booking
