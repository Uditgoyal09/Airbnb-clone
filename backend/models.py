from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, Date, DateTime
from sqlalchemy.orm import relationship
import datetime

from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    is_host = Column(Boolean, default=False)
    avatar_url = Column(String, nullable=True)

    listings = relationship("Listing", back_populates="host")
    bookings = relationship("Booking", back_populates="guest")

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(Text)
    location = Column(String, index=True)
    price_per_night = Column(Float)
    property_type = Column(String)
    max_guests = Column(Integer)
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    amenities = Column(String)  # JSON string
    photos = Column(String)      # JSON string
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    rating = Column(Float, default=4.95)
    num_reviews = Column(Integer, default=0)
    category = Column(String, default="trending")  # e.g. beach, cabin, pool, trending
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    host = relationship("User", back_populates="listings")
    bookings = relationship("Booking", back_populates="listing")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    guest_id = Column(Integer, ForeignKey("users.id"))
    check_in = Column(Date)
    check_out = Column(Date)
    total_price = Column(Float)
    guest_count = Column(Integer, default=1)
    status = Column(String, default="confirmed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")
