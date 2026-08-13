# Airbnb Clone

A functional clone of the Airbnb web application that replicates the core booking workflows, design, and user experience.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Vanilla CSS (CSS Modules), Leaflet (for Maps), react-date-range (for Calendar)
- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
- **Database:** SQLite

## Architecture Overview
The application uses a separated frontend and backend architecture:
- The **FastAPI backend** serves a REST API providing CRUD operations for users, listings, and bookings. It uses SQLAlchemy as an ORM to interact with a local SQLite database (`airbnb.db`).
- The **Next.js frontend** is built using React Server Components for SEO and fast initial page loads, falling back to Client Components for interactive elements (like the Booking Widget and Host Dashboard forms). State management is handled through standard React hooks. Styling is done meticulously using CSS modules to mimic Airbnb's design system without relying on external libraries like Tailwind.

## Database Schema (SQLite)
The database contains three primary tables:
1. **users**: Stores basic user details (`id`, `name`, `email`, `is_host`, `avatar_url`).
2. **listings**: Stores property details (`id`, `host_id` (FK), `title`, `description`, `location`, `price_per_night`, `property_type`, `max_guests`, `bedrooms`, `bathrooms`, `amenities`, `photos`, `latitude`, `longitude`, `rating`).
3. **bookings**: Stores reservation details (`id`, `listing_id` (FK), `guest_id` (FK), `check_in`, `check_out`, `total_price`, `status`).

## Key Features & UI Replications
- **Interactive Split Map View**: Search results seamlessly display side-by-side with an interactive map using Leaflet, showing dynamic price pill markers that correspond exactly to listings in the area.
- **Advanced Search & Popovers**: The header features an authentic expanding search bar with a "Where" destination suggestions popover, and a "When" flexible date picker offering both a calendar view and custom "flexible months" UI.
- **Optimized Layout & Animations**: The top navigation features high-performance, CSS-driven scroll transitions, smoothly shrinking the full search bar into a compact pill to maximize screen space.
- **Horizontal & Vertical Cards**: Listing cards automatically adapt their layout (vertical grid vs horizontal wide rows) based on the current view mode (Grid vs Split Map), mimicking the original application.
- **Mock User Profiles System**: An interactive header menu allows seamless switching between multiple mock users (Hosts and Guests) to demonstrate booking and listing flows without needing real authentication.
- **Extensive Seeded Data**: The database comes pre-loaded with over 60 realistic listings spread across major Indian locations (Delhi, Goa, Zirakpur, Chandigarh, Mumbai, Bangalore) complete with precise GPS coordinates.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Create and activate a virtual environment (Windows example):
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn[standard] sqlalchemy pydantic
   ```
4. Seed the database with mock data (this creates 60 listings across India):
   ```bash
   python -m backend.seed
   ```
5. Start the FastAPI server (Run this from the project root directory):
   ```bash
   uvicorn backend.main:app --reload
   ```
   The backend will be running at `http://localhost:8000`. API docs are available at `http://localhost:8000/docs`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Create a `.env.local` file in the `frontend` root and add the backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## Assumptions & Mocks
- **Authentication:** Real user authentication is bypassed. The application mocks a "Guest" view for bookings and trips, and a "Host" view for managing listings in the Host Dashboard. You can easily switch users in the navbar profile dropdown.
- **Payments:** The booking flow calculates totals including mock fees, but actual payment processing is not implemented.
- **Photos:** Images are mocked using Unsplash (picsum.photos) URLs configured in `next.config.js`.
