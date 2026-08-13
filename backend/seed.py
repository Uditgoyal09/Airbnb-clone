import json
import datetime
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend import models, crud, schemas

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data
    db.query(models.Booking).delete()
    db.query(models.Listing).delete()
    db.query(models.User).delete()
    db.commit()

    # ── Create Users ─────────────────────────────────────────────────────────
    host1 = crud.create_user(db, schemas.UserCreate(
        name="Ananya Sharma", email="ananya@example.com", is_host=True,
        avatar_url="https://i.pravatar.cc/150?u=ananya"
    ))
    host2 = crud.create_user(db, schemas.UserCreate(
        name="Vikram Mehta", email="vikram@example.com", is_host=True,
        avatar_url="https://i.pravatar.cc/150?u=vikram"
    ))
    guest1 = crud.create_user(db, schemas.UserCreate(
        name="Rahul Gupta", email="rahul@example.com", is_host=False,
        avatar_url="https://i.pravatar.cc/150?u=rahul"
    ))
    guest2 = crud.create_user(db, schemas.UserCreate(
        name="Priya Singh", email="priya@example.com", is_host=False,
        avatar_url="https://i.pravatar.cc/150?u=priya"
    ))

    wifi = "Wifi"
    kitchen = "Kitchen"
    parking = "Free parking"
    ac = "Air conditioning"
    pool = "Pool"
    gym = "Gym"
    beach = "Beach access"
    tv = "55\" HDTV"
    washer = "Washer"
    dryer = "Dryer"
    workspace = "Dedicated workspace"
    hot_tub = "Hot tub"
    bbq = "BBQ grill"
    fireplace = "Indoor fireplace"
    balcony = "Balcony"
    garden = "Garden"

    cities = [
        {"name": "Zirakpur, Punjab", "lat": 30.6424, "lng": 76.8174},
        {"name": "Chandigarh", "lat": 30.7333, "lng": 76.7794},
        {"name": "Sahibzada Ajit Singh Nagar, Punjab", "lat": 30.7046, "lng": 76.7179},
        {"name": "Delhi", "lat": 28.6139, "lng": 77.2090},
        {"name": "Mumbai, Maharashtra", "lat": 19.0760, "lng": 72.8777},
        {"name": "Goa", "lat": 15.2993, "lng": 74.1240},
        {"name": "Bangalore, Karnataka", "lat": 12.9716, "lng": 77.5946}
    ]

    property_types = ["Apartment", "Villa", "Flat", "Bungalow", "Cabin", "Studio"]
    categories = ["trending", "beach", "cabin", "pool"]
    adjectives = ["Cozy", "Luxury", "Beautiful", "Spacious", "Modern", "Vintage", "Charming", "Stunning"]
    
    import random
    random.seed(42) # For reproducible random data

    listings_data = []
    
    # Generate 60 listings (roughly 8-9 per city)
    for i in range(60):
        city = random.choice(cities)
        prop_type = random.choice(property_types)
        adj = random.choice(adjectives)
        
        # Add a small random offset to the lat/lng so they don't overlap perfectly
        lat_offset = random.uniform(-0.04, 0.04)
        lng_offset = random.uniform(-0.04, 0.04)
        
        listings_data.append({
            "title": f"{adj} {prop_type} in {city['name'].split(',')[0]}",
            "description": f"Enjoy a wonderful stay at this {adj.lower()} {prop_type.lower()} located in the heart of {city['name']}. Perfect for a relaxing getaway.",
            "location": city["name"],
            "price": random.randint(30, 250) * 100, # 3000 to 25000
            "property_type": prop_type,
            "max_guests": random.randint(2, 10),
            "bedrooms": random.randint(1, 5),
            "bathrooms": float(random.randint(1, 4)),
            "amenities": [wifi, kitchen, ac, tv, parking] + random.sample([pool, gym, beach, workspace, hot_tub, bbq], 2),
            "seed": f"house_{i}", 
            "rating": round(random.uniform(4.5, 5.0), 2), 
            "reviews": random.randint(10, 300),
            "lat": city["lat"] + lat_offset, 
            "lng": city["lng"] + lng_offset, 
            "host_id": host1.id if i % 2 == 0 else host2.id, 
            "category": random.choice(categories)
        })

    created_listings = []
    for data in listings_data:
        photos = [
            f"https://picsum.photos/seed/{data['seed']}-1/900/600",
            f"https://picsum.photos/seed/{data['seed']}-2/900/600",
            f"https://picsum.photos/seed/{data['seed']}-3/900/600",
            f"https://picsum.photos/seed/{data['seed']}-4/900/600",
            f"https://picsum.photos/seed/{data['seed']}-5/900/600",
        ]
        listing = crud.create_listing(db, schemas.ListingCreate(
            title=data["title"],
            description=data["description"],
            location=data["location"],
            price_per_night=data["price"],
            property_type=data["property_type"],
            max_guests=data["max_guests"],
            bedrooms=data["bedrooms"],
            bathrooms=data["bathrooms"],
            amenities=json.dumps(data["amenities"]),
            photos=json.dumps(photos),
            host_id=data["host_id"],
            latitude=data["lat"],
            longitude=data["lng"],
            rating=data["rating"],
            num_reviews=data["reviews"],
            category=data["category"]
        ))
        created_listings.append(listing)

    # ── Seed some pre-existing bookings ──────────────────────────────────────
    today = datetime.date.today()
    future_bookings = [
        {
            "listing": created_listings[0], "guest_id": guest1.id,
            "check_in": today + datetime.timedelta(days=5),
            "check_out": today + datetime.timedelta(days=8),
            "guests": 2
        },
        {
            "listing": created_listings[2], "guest_id": guest2.id,
            "check_in": today + datetime.timedelta(days=2),
            "check_out": today + datetime.timedelta(days=5),
            "guests": 4
        },
        {
            "listing": created_listings[6], "guest_id": guest1.id,
            "check_in": today + datetime.timedelta(days=15),
            "check_out": today + datetime.timedelta(days=20),
            "guests": 6
        },
    ]

    for bdata in future_bookings:
        listing = bdata["listing"]
        nights = (bdata["check_out"] - bdata["check_in"]).days
        total = nights * listing.price_per_night * 1.12
        crud.create_booking(db, schemas.BookingCreate(
            listing_id=listing.id,
            guest_id=bdata["guest_id"],
            check_in=bdata["check_in"],
            check_out=bdata["check_out"],
            total_price=round(total, 2),
            guest_count=bdata["guests"]
        ))

    print(f"SUCCESS: Seeded {len(created_listings)} listings and {len(future_bookings)} bookings.")
    db.close()

if __name__ == "__main__":
    seed_data()
