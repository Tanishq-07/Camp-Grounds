
# Camp-Grounds

Welcome to Camp-Grounds! This is a web application that allows users to access and create campgrounds online.

## Introduction
Camp-Grounds is an online platform where users can view and share information about their own campgrounds. Users can create new campground listings, view details of existing campgrounds also on 3D and 2D maps, and leave comments.

## Features
- **User Authentication:** Secure user registration and login.
- **Campground Management:** Create, edit, delete, and view campgrounds.
- **Commenting System:** Users can leave comments on campgrounds.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used
- **Frontend:**
  - HTML
  - CSS
  - Bootstrap
  - Javascript
- **Backend:**
  - Node.js
  - Express
  - MongoDB (Mongoose)
- **Authentication:**
  - Passport.js

## Installation
To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/camp-grounds.git
   cd camp-grounds
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `server` directory and add the following:
   ```env
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_KEY=your_cloudinary_cloud_ket
   CLOUDINARY_SECRET=your_cloudinary_secret

   MAPBOX_TOKEN=your_mapboxtoken

   SECRET=your_secretCode_for_sessions

   DB_URL=your_mongodb_uri
   ```

4. **Run the application:**
   ```bash
   node app.js or nodemon app.js
   ```

   The application should now be running on `http://localhost:3000`.

## Usage
1. Register for a new account or log in with existing credentials.
2. Browse the list of available campgrounds nearby along with their location on the map.
3. Click on any campground to view more details.
4. Create, edit, or delete your own campgrounds.
5. Leave comments on campgrounds to share your experience.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the code style and include tests for your changes.
