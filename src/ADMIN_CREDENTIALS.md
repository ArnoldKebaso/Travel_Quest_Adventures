# TravelQuest Adventures - Admin System

## Login Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full admin panel with all management features

### Regular User Account
- **Username:** `user`
- **Password:** `user123`
- **Access:** Public TravelQuest Adventures website

## Admin Features

### 1. Dashboard
- Overview statistics (destinations, tours, blogs, reviews, bookings, revenue)
- Recent bookings list
- Pending reviews list

### 2. Destinations Management
- View all destinations
- Create new destinations
- Edit existing destinations
- Delete destinations
- Manage: title, location, description, category, region, best time to visit, price

### 3. Tours Management
- View all tours
- Create new tours
- Edit existing tours
- Delete tours
- Manage: title, location, description, duration, price, group size, difficulty, highlights

### 4. Blogs Management
- View all blog posts
- Create new blog posts
- Edit existing blog posts
- Delete blog posts
- Manage: title, excerpt, content, author, category, read time

### 5. Reviews Management
- View all reviews (pending, approved, rejected)
- Approve pending reviews
- Reject pending reviews
- Filter by status
- View destination details for each review

### 6. Bookings Management
- View all bookings
- View detailed booking information
- Confirm pending bookings
- Cancel bookings
- View customer information (name, email, phone)
- View special requests
- Track booking status

## Important Notes

- All data is currently stored in static files (`/utils/staticData.ts`)
- Changes made in the admin panel are stored in component state (not persisted)
- Only approved reviews are displayed on the public site
- User authentication (via AWS Cognito) will be added later
- Admin authentication uses hardcoded credentials for demo purposes
