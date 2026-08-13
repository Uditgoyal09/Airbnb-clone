import datetime
from typing import List, Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    is_host: bool = False
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class ListingBase(BaseModel):
    title: str
    description: str
    location: str
    price_per_night: float
    property_type: str
    max_guests: int
    bedrooms: int
    bathrooms: float
    amenities: str  # JSON string
    photos: str     # JSON string
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = 4.95
    num_reviews: Optional[int] = 0
    category: Optional[str] = "trending"

class ListingCreate(ListingBase):
    host_id: int

class Listing(ListingBase):
    id: int
    host_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    check_in: datetime.date
    check_out: datetime.date
    total_price: float
    guest_count: Optional[int] = 1

class BookingCreate(BookingBase):
    listing_id: int
    guest_id: int

class Booking(BookingBase):
    id: int
    listing_id: int
    guest_id: int
    status: str
    created_at: datetime.datetime
    listing: Optional[Listing] = None
    guest: Optional[User] = None

    class Config:
        from_attributes = True

class BookedDateRange(BaseModel):
    check_in: datetime.date
    check_out: datetime.date
