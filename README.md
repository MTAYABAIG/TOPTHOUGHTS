# Top Thought - Modern MERN Stack Blog Platform

A beautiful, full-featured blog platform built with the MERN stack, featuring a responsive design, admin dashboard, YouTube video integration, and dedicated video viewing pages.

## Features

### Frontend
- **Modern React Application** with TypeScript
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Beautiful UI** with soft pastels and smooth animations
- **Framer Motion** animations and transitions
- **Blog Management** - view, create, edit, and delete posts
- **YouTube Video Integration** using react-player
- **Dedicated Video Pages** for YouTube content linked to blog posts
- **Search Functionality** for blog posts
- **Pagination** for better performance
- **JWT Authentication** for admin access
- **About Us** and **Contact Us** pages
- **YouTube Channel Integration** in header and footer

### Backend
- **Express.js API** with comprehensive routes
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for secure admin access
- **Input Validation** and error handling
- **CORS Support** for cross-origin requests
- **RESTful API Design** following best practices

### Design Features
- **Light Mode Theme** with soft pastels
- **Gradient Backgrounds** and subtle shadows
- **Interactive Hover States** and micro-animations
- **Professional Typography** using Inter and Playfair Display
- **Consistent Spacing** with 8px grid system
- **Accessible Design** with proper contrast ratios

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Video Player**: React Player
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd top-thought-blog
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update MongoDB connection string and JWT secret
   ```env
   MONGODB_URI=mongodb://localhost:27017/blog-app
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   PORT=5000
   ```

5. **Start the development servers**
   
   **Option 1: Run both servers concurrently**
   ```bash
   npm run dev:full
   ```
   
   **Option 2: Run servers separately**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Default Admin Credentials
- **Username**: admin
- **Password**: admin123

## Project Structure

```
top-thought-blog/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── Layout/              # Header, Footer components
│   │   ├── Blog/                # Blog-related components
│   │   ├── Auth/                # Authentication components
│   │   └── UI/                  # Reusable UI components
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── BlogPage.tsx         # Blog listing
│   │   ├── BlogPostPage.tsx     # Individual blog post
│   │   ├── VideoPage.tsx        # Dedicated video viewing
│   │   ├── AboutPage.tsx        # About us page
│   │   ├── ContactPage.tsx      # Contact form
│   │   ├── LoginPage.tsx        # Admin login
│   │   ├── AdminDashboard.tsx   # Admin dashboard
│   │   ├── CreatePostPage.tsx   # Create new post
│   │   └── EditPostPage.tsx     # Edit existing post
│   ├── contexts/                # React contexts (Auth)
│   ├── data/                    # Mock data and types
│   └── App.tsx                  # Main App component
├── backend/                     # Backend source code
│   ├── server.js               # Express server
│   └── package.json            # Backend dependencies
├── public/                      # Static assets
└── README.md                   # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Blog Posts
- `GET /api/posts` - Get all posts (with pagination and search)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Health Check
- `GET /api/health` - API health status

## Features in Detail

### Admin Dashboard
- Overview statistics
- Complete CRUD operations for blog posts
- Real-time preview while editing
- Image and YouTube video URL support
- Form validation and error handling

### Blog Features
- Featured post display
- Responsive card-based layout
- Search functionality
- Pagination for performance
- YouTube video embedding
- Dedicated video viewing pages
- Social sharing capabilities

### Video Integration
- YouTube video embedding in blog posts
- Dedicated video pages with enhanced viewing experience
- Video indicators on blog cards
- Direct links to YouTube channel
- Subscribe prompts and channel integration

### Additional Pages
- **About Us**: Company story, values, mission, and team information
- **Contact Us**: Contact form, company information, and FAQ section
- **YouTube Integration**: Channel links in header and footer

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes
- Color contrast compliance

## Deployment

### Frontend (Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Vercel
3. Configure environment variables

### Backend (Railway/Render/Heroku)
1. Push backend code to your repository
2. Configure environment variables
3. Set start command: `npm start`
4. Connect MongoDB Atlas database

### Environment Variables for Production
```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
PORT=5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email hello@topthought.com or create an issue in the repository.