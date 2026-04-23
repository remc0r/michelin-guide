# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Michelin Guide is a web application for discovering restaurants and hotels, featuring a curated selection from the Michelin Guide. It's built as a full-stack application with a React frontend and Express.js backend.

**Tech Stack:**
- **Frontend**: React 18.2, Tailwind CSS, Radix UI components, React Router 7
- **Backend**: Express.js, MongoDB (native driver), Jest + Supertest for testing
- **Build Tools**: CRACO (Create React App Config Override)
- **Styling**: Tailwind CSS with custom design system

## Project Structure

```
michelin-guide/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── db/mongo.js        # MongoDB connection (singleton pattern)
│   │   └── routes/            # API route handlers
│   ├── scripts/
│   │   └── seedMongo.js      # Database seeding script
│   ├── tests/
│   │   ├── unit/             # Unit tests
│   │   └── integration/      # Integration tests (Supertest)
│   ├── data/
│   │   └── mockData.js       # Mock data fallback
│   └── package.json
├── frontend/                  # React application
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/       # Reusable components (incl. UI library)
│   │   ├── pages/           # Route page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── craco.config.js       # CRACO configuration
│   └── package.json
└── michelin_my_maps.csv     # Restaurant data source
```

## Common Commands

### Backend
```bash
cd backend
npm install           # Install dependencies
npm start            # Start production server (port 8000)
npm run dev          # Start development server with --watch
npm run seed         # Seed MongoDB with test data
npm test             # Run all tests
npm run test:unit    # Run unit tests only
npm run test:int     # Run integration tests only
```

### Frontend
```bash
cd frontend
npm install           # Install dependencies
npm start            # Start dev server (port 3000, proxied to backend:8000)
npm run build        # Build for production
npm test             # Run Jest tests
```

### Database Setup (MongoDB)
```bash
# Using Docker (recommended)
docker run -d --name michelin-mongo -p 27017:27017 -v michelin_mongo_data:/data/db mongo:7

# Verify connection
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"

# Start/stop existing container
docker start michelin-mongo
docker stop michelin-mongo
```

## Backend Architecture

### Database Layer (`src/db/mongo.js`)
- Singleton pattern for MongoDB connection
- `connectToMongo()`: Establishes connection and returns `{client, db}`
- `getDb()`: Returns database instance (throws if not connected)
- Required env vars: `MONGO_URL`, `DB_NAME`

### API Routes Structure
All routes are prefixed with `/api`:

- `GET /api/` - Health check endpoint
- `GET /api/parcours?city=&group_type=&moment=` - Personalized recommendations
- `GET /api/restaurants` - Restaurant listing with filters (`city`, `q`)
- `GET /api/restaurants/:slug` - Single restaurant details
- `GET /api/status` - MongoDB connection status

### Data Normalization
Backend normalizes restaurant data between different schemas:
- Handles `priceRange`/`price_range` variations
- Handles `image`/`imageUrl` variations
- Auto-generates `slug` if missing
- Normalizes gallery arrays

### Fallback Pattern
All endpoints implement graceful fallback to mock data when MongoDB is unavailable, allowing development without database connectivity.

### Testing Strategy
- **Unit tests**: Mock data, logic validation in `tests/unit/`
- **Integration tests**: HTTP endpoint testing with Supertest in `tests/integration/`
- Tests are organized by project in `jest.config.js`

## Frontend Architecture

### Routing
Uses React Router 7 with the following routes:
- `/` - Home page
- `/restaurants` - Restaurant listing
- `/restaurants/:slug` - Restaurant details
- `/hotels` - Hotels listing
- `/magazine` - Magazine articles
- `/magazine/:slug` - Article details
- `/reservation/:slug` - Reservation form

### API Client Pattern
All API calls are centralized in `src/api/`:
```javascript
export async function fetchRestaurants(params = {}) {
  // Accepts {city, q} params
  // Returns JSON array of restaurants
}

export async function fetchRestaurantBySlug(slug) {
  // Returns restaurant object or null if 404
}
```

### Component Structure
- **Components**: Reusable UI components (`Navbar`, `Footer`, `RestaurantCard`)
- **UI Components**: Radix UI-based component library in `src/components/ui/`
- **Pages**: Route-specific page components in `src/pages/`
- **Hooks**: Custom React hooks in `src/hooks/`

### Styling
- Tailwind CSS for styling
- Custom utility functions in `src/lib/utils.js` for class name merging
- Radix UI components provide accessible base components
- Design system follows a premium, minimal aesthetic inspired by Michelin Guide

### Build Configuration
- CRACO configuration in `craco.config.js`
- Webpack alias `@` → `src/`
- React hooks ESLint rules enforced
- Health check plugin available via `ENABLE_HEALTH_CHECK=true`

## Environment Variables

### Backend (`backend/.env`)
```dotenv
PORT=8000
MONGO_URL=mongodb://localhost:27017
DB_NAME=michelin_guide
CORS_ORIGINS=http://localhost:3000
```

### Development Workflow
1. Start MongoDB (Docker or local service)
2. Configure backend environment variables
3. Run `npm run seed` to populate database
4. Start backend: `npm run dev` (or `npm start`)
5. Start frontend: `npm start`
6. Access application at `http://localhost:3000`

## Data Import

The `michelin_my_maps.csv` contains restaurant data for import. Use this as reference for seeding MongoDB or creating mock data.

**Note:** Current implementation uses `data/mockData.js` for fallback data and database seeding.

## Key Patterns

1. **MongoDB Fallback**: All database operations wrap in try/catch and fall back to mock data
2. **Slug Generation**: Auto-generated from names using unicode normalization and lowercase conversion
3. **Query Normalization**: Backend handles multiple field name variations (`priceRange` vs `price_range`)
4. **API Proxy**: Frontend dev server proxies `/api/*` to backend port 8000
5. **Modular Routes**: Each route group has its own router module for organization

## Testing

Run tests from respective directories:
- Backend tests require Jest and mock MongoDB or actual database connection
- Frontend uses Jest with React Testing Library
- Integration tests use Supertest for HTTP endpoint validation

## Notes

- The application is primarily French-language focused
- Design aesthetic is premium and minimal (Michelin Guide inspired)
- Backend gracefully handles MongoDB unavailability
- Frontend uses a proxy configuration for API calls in development mode
