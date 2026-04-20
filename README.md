# Victory United Soccer Academy - Backend API

A comprehensive Node.js backend API for Victory United Soccer Academy management system.

## Features

- **Authentication & Authorization**: JWT-based admin authentication
- **Player Management**: CRUD operations for players with filtering and search
- **Coach Management**: Complete coach profiles with experience tracking
- **Notice Board**: Pinnable notices with content management
- **Enquiry System**: Contact form submissions with status tracking
- **File Upload**: Cloudinary integration for image uploads
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **Development**: nodemon

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and setup**
   ```bash
   cd victory-united-backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/victory-united
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_EMAIL=admin@victoryunited.com
   ADMIN_PASSWORD=admin123
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Database Setup**
   ```bash
   # Create admin user
   node scripts/createAdmin.js
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info
- `POST /api/auth/change-password` - Change admin password

### Players
- `GET /api/players` - Get all players (public)
- `GET /api/players/:id` - Get single player (public)
- `POST /api/players` - Create player (admin)
- `PUT /api/players/:id` - Update player (admin)
- `DELETE /api/players/:id` - Delete player (admin)
- `GET /api/players/stats/summary` - Get player statistics (public)

### Coaches
- `GET /api/coaches` - Get all coaches (public)
- `GET /api/coaches/:id` - Get single coach (public)
- `POST /api/coaches` - Create coach (admin)
- `PUT /api/coaches/:id` - Update coach (admin)
- `DELETE /api/coaches/:id` - Delete coach (admin)
- `GET /api/coaches/stats/summary` - Get coach statistics (public)

### Notices
- `GET /api/notices` - Get all notices (public)
- `GET /api/notices/:id` - Get single notice (public)
- `POST /api/notices` - Create notice (admin)
- `PUT /api/notices/:id` - Update notice (admin)
- `PATCH /api/notices/:id/pin` - Toggle pin status (admin)
- `DELETE /api/notices/:id` - Delete notice (admin)
- `GET /api/notices/stats/summary` - Get notice statistics (admin)

### Enquiries
- `GET /api/enquiries` - Get all enquiries (admin)
- `GET /api/enquiries/:id` - Get single enquiry (admin)
- `POST /api/enquiries` - Submit enquiry (public)
- `PATCH /api/enquiries/:id/status` - Update status (admin)
- `PATCH /api/enquiries/:id/notes` - Add notes (admin)
- `DELETE /api/enquiries/:id` - Delete enquiry (admin)
- `GET /api/enquiries/stats/summary` - Get enquiry statistics (admin)

### File Upload
- `POST /api/upload/image` - Upload image (admin)
- `DELETE /api/upload/image/:publicId` - Delete image (admin)

### Health Check
- `GET /api/health` - API health status

## Data Models

### Player
```javascript
{
  name: String (required),
  ageGroup: String (required),
  position: String (required),
  imageUrl: String,
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Coach
```javascript
{
  name: String (required),
  role: String (required),
  experienceYears: Number (required),
  description: String,
  imageUrl: String,
  isHeadCoach: Boolean (default: false),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Notice
```javascript
{
  title: String (required),
  content: String (required),
  isPinned: Boolean (default: false),
  isActive: Boolean (default: true),
  createdBy: String,
  timestamps: true
}
```

### Enquiry
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  childAge: String (required),
  message: String,
  status: String (enum: ['new', 'read', 'resolved']),
  notes: String,
  timestamps: true
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation and sanitization
- **Soft Deletes**: Data preservation with isActive flags

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node scripts/createAdmin.js` - Create admin user

### Database Indexes
The application creates indexes for optimal query performance:
- Players: ageGroup, position, text search
- Coaches: isHeadCoach, experienceYears, text search
- Notices: isPinned, createdAt, text search
- Enquiries: status, createdAt, text search

## Production Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use MongoDB Atlas or secure MongoDB instance
3. **File Storage**: Configure Cloudinary for image uploads
4. **Security**: Use strong JWT secret and admin credentials
5. **Monitoring**: Implement logging and monitoring solutions

## API Response Format

### Success Response
```javascript
{
  message: "Operation successful",
  data: { ... }, // Response data
  pagination: { ... } // For paginated responses
}
```

### Error Response
```javascript
{
  message: "Error description",
  errors: [ ... ] // Validation errors (if any)
}
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details