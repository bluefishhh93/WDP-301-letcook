# LetCook - Modern Food Recipe & Ordering Platform

## 🍳 Overview

LetCook is a comprehensive full-stack web application that combines recipe sharing and food ordering capabilities. Built with modern technologies, it offers a seamless experience for users to discover, share, and order food recipes.

## ✨ Features

- **AI-Powered Features**
  - AI recipe nutrition calculation
  - Natural language recipe search
  - 
- **Recipe Management**
  - Create, share, and discover food recipes
  - Rich text editor with image support
  - Recipe categorization and search
  - Interactive recipe ratings and reviews

- **User Authentication**
  - Multiple authentication methods (JWT, OAuth)
  - Support for Google and Discord login
  - Secure session management

- **Order System**
  - Integrated food ordering capabilities
  - Payment integration with VNPay
  - Delivery integration with Giao Hang Nhanh

- **Real-time Features**
  - Real-time notifications

- **Advanced UI/UX**
  - Responsive design
  - Dark/Light theme support
  - Infinite scroll
  - Progressive loading
  - Toast notifications

## 🛠 Tech Stack

### Frontend (letcook_client)
- **Framework**: Next.js 14
- **State Management**: Zustand
- **UI Components**: 
  - Shadcn/UI
  - TailwindCSS
- **Form Handling**: React Hook Form, Zod
- **Data Fetching**: SWR, Axios
- **Authentication**: NextAuth.js
- **Additional Features**:
  - React Quill for rich text editing
  - Framer Motion for animations
  - Socket.io for real-time features
  - Cloudinary for image management

### Backend (letcook_api)
- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: PostgreSQL and MongoDB with TypeORM
- **Authentication**: Passport.js, JWT
- **File Upload**: Multer with Cloudinary
- **API Documentation**: Express Validator
- **Additional Features**:
  - Socket.io for real-time communication
  - Morgan for logging
  - CORS enabled
  - Cookie-based session management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- PostgreSQL database
- Cloudinary account
- (Optional) OAuth credentials for Google/Discord

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies for client
```bash
cd letcook_client
bun install
```

3. Install dependencies for API
```bash
cd letcook_api
bun install
```

4. Set up environment variables
- Create `.env` files in both client and API directories
- Configure necessary environment variables (database, auth, etc.)

5. Start development servers

For client:
```bash
cd letcook_client
bun dev
```

For API:
```bash
cd letcook_api
bun dev
```

The client will run on port 4000 and the API on the configured port.

## 🔒 Environment Variables

### Client
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=  
OPENAI_API_KEY=
```

### API
```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
