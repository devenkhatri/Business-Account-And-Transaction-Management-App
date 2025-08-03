# Business Account & Transaction Management System

A complete Next.js MVP application for managing business accounts, transactions, and generating reports.

## Features

- **Authentication**: Secure login with NextAuth.js (credentials: admin/admin123)
- **Dashboard**: Real-time metrics, charts, and data visualization
- **Transaction Management**: Full CRUD operations with advanced filtering
- **Account Management**: Account profiles with transaction history
- **Location Management**: Multi-location business support
- **Reports**: Comprehensive reporting with CSV export
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **TypeScript**: Full type safety

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Seed the database**:
   ```bash
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with: `admin` / `admin123`

## Environment Variables

Create a `.env.local` file with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
```

## Database Schema

- **Locations**: Business locations with names and addresses
- **Accounts**: Customer accounts with contact information
- **Transactions**: Financial transactions linked to accounts and locations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Sample Data

The seed script creates:
- 3 business locations
- 6 customer accounts
- 120+ randomized transactions over the last 30 days

## Login Credentials

- **Username**: admin
- **Password**: admin123

## Architecture

The application follows a modular architecture with:
- API routes for all CRUD operations
- Reusable UI components
- Type-safe database operations
- Global state management
- Responsive design patterns

## Production Deployment

1. Update environment variables for production
2. Change the NEXTAUTH_SECRET to a secure random string
3. Configure your production database
4. Run `npm run build` to create a production build
5. Deploy to your preferred hosting platform

## Support

This is a complete MVP implementation ready for immediate use and further development.