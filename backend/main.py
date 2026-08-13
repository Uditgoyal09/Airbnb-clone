from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime

from backend import crud, models, schemas
from backend.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─── Users ───────────────────────────────────────────────────────────────────

@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/api/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@app.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# ─── Listings ─────────────────────────────────────────────────────────────────

@app.get("/api/listings/", response_model=List[schemas.Listing])
def read_listings(
    skip: int = 0,
    limit: int = 100,
    location: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    property_type: Optional[str] = Query(None),
    guests: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    host_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    return crud.get_listings(db, skip=skip, limit=limit, location=location,
                             min_price=min_price, max_price=max_price,
                             property_type=property_type, guests=guests,
                             category=category, host_id=host_id)

@app.post("/api/listings/", response_model=schemas.Listing)
def create_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    return crud.create_listing(db=db, listing=listing)

@app.get("/api/listings/{listing_id}", response_model=schemas.Listing)
def read_listing(listing_id: int, db: Session = Depends(get_db)):
    db_listing = crud.get_listing(db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing

@app.put("/api/listings/{listing_id}", response_model=schemas.Listing)
def update_listing(listing_id: int, listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    db_listing = crud.update_listing(db=db, listing_id=listing_id, listing=listing)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing

@app.delete("/api/listings/{listing_id}")
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    db_listing = crud.delete_listing(db=db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "Listing deleted successfully"}

@app.get("/api/listings/{listing_id}/bookings", response_model=List[schemas.Booking])
def read_listing_bookings(listing_id: int, db: Session = Depends(get_db)):
    return crud.get_bookings_for_listing(db, listing_id=listing_id)

# ─── Bookings ─────────────────────────────────────────────────────────────────

@app.post("/api/bookings/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # Validate dates
    if booking.check_in >= booking.check_out:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")
    if booking.check_in < datetime.date.today():
        raise HTTPException(status_code=400, detail="Check-in cannot be in the past")
    # Check for overlapping bookings
    if crud.check_date_overlap(db, booking.listing_id, booking.check_in, booking.check_out):
        raise HTTPException(status_code=409, detail="These dates are already booked")
    return crud.create_booking(db=db, booking=booking)

@app.get("/api/bookings/{booking_id}", response_model=schemas.Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = crud.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking

@app.post("/api/bookings/{booking_id}/cancel", response_model=schemas.Booking)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = crud.cancel_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking

@app.get("/api/users/{user_id}/bookings", response_model=List[schemas.Booking])
def read_user_bookings(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_bookings_for_guest(db, guest_id=user_id, skip=skip, limit=limit)
