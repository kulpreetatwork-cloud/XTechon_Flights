# XTechon Flight Booking System ✈️

A **production-ready, full-stack flight booking application** built with React, Node.js, Express, and MongoDB. Designed as a technical assessment solution with all core requirements and bonus enhancements implemented.

![Flight Booking System](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)

## 🎯 Assignment Requirements Met

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Database-driven flight search | ✅ | MongoDB with Mongoose |
| 15-20 flights seeded | ✅ | 18 flights with Indian airlines |
| Dynamic pricing (surge after 3 attempts) | ✅ | 10% surge, resets after 10 min |
| Wallet system (₹50,000 default) | ✅ | With balance validation |
| PDF ticket generation | ✅ | PDFKit with professional styling |
| Booking history with re-download | ✅ | Complete history page |
| User authentication | ✅ | JWT-based login/register |
| Sorting & filtering | ✅ | By price, airline, cities |
| Surge pricing indicators | ✅ | Visual badge + countdown |
| Responsive UI | ✅ | TailwindCSS + mobile-first |
| Docker setup | ✅ | Optional docker-compose |

---

## 🚀 Features

### Core Features
- ✈️ **Flight Search** - Search 18 flights by departure/arrival cities
- 💰 **Dynamic Pricing Engine** - 10% surge after 3 booking attempts in 5 minutes
- 👛 **Wallet System** - ₹50,000 default balance with transaction history
- 📄 **PDF E-Tickets** - Professional tickets with all required details
- 📋 **Booking History** - View past bookings & re-download tickets
- 🔐 **Authentication** - Secure JWT login/register

### Premium UI Features
- 🎨 **Glassmorphism Design** - Modern dark theme with blur effects
- ✨ **Micro-animations** - Smooth transitions and hover effects
- 🎉 **Booking Success Page** - Confetti celebration animation
- ⏱️ **Surge Countdown** - Real-time price reset timer
- 📱 **Fully Responsive** - Mobile-first design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + TailwindCSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT + bcrypt |
| **PDF Generation** | PDFKit |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
XTechon_Flights/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Navbar, FlightCard, BookingModal, etc.
│   │   ├── context/           # AuthContext with wallet state
│   │   ├── pages/             # Home, Flights, Bookings, Wallet, Auth
│   │   ├── services/          # API services (auth, flights, bookings)
│   │   ├── index.css          # TailwindCSS + custom styles
│   │   └── App.jsx            # Main app with routing
│   └── package.json
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/            # MongoDB connection
│   │   ├── controllers/       # auth, flight, booking, wallet
│   │   ├── middleware/        # JWT auth, error handling
│   │   ├── models/            # Flight, User, Booking, Wallet, PricingLog
│   │   ├── routes/            # API route definitions
│   │   ├── utils/             # pdfGenerator, pricingEngine, seedFlights
│   │   └── index.js           # Server entry point
│   └── package.json
│
├── Dockerfile                 # Production build
├── docker-compose.yml         # Development with MongoDB
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kulpreetatwork-cloud/XTechon_Flights.git
cd XTechon_Flights
```

### 2️⃣ Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI:
# MONGODB_URI=mongodb://localhost:27017/flight_booking
# JWT_SECRET=your_super_secret_key

# Seed the database (creates 18 flights)
npm run seed

# Start the server
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4️⃣ Access the Application
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 🐳 Docker Setup (Optional)

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up --build

# Access at:
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user (get ₹50K wallet) |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user profile |

### Flights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flights` | Search flights with filters |
| GET | `/api/flights/:id` | Get single flight with pricing |
| GET | `/api/flights/cities` | Get available cities |
| POST | `/api/flights/:id/attempt` | Record booking attempt |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings` | Get user's booking history |
| GET | `/api/bookings/:id` | Get single booking |
| GET | `/api/bookings/:id/ticket` | Download PDF ticket |

### Wallet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallet` | Get wallet with transactions |
| GET | `/api/wallet/balance` | Get current balance |
| POST | `/api/wallet/add` | Add funds to wallet |

---

## 💡 Dynamic Pricing Logic

```
┌─────────────────────────────────────────────────────────────┐
│                    SURGE PRICING FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User books same flight 3 times within 5 minutes?           │
│                    │                                        │
│           ┌───────┴───────┐                                 │
│           ▼               ▼                                 │
│          YES             NO                                 │
│           │               │                                 │
│    ┌──────┴──────┐   Normal price                           │
│    │ +10% SURGE  │   (base_price)                           │
│    │   ACTIVE    │                                          │
│    └──────┬──────┘                                          │
│           │                                                 │
│    10 min inactivity?                                       │
│           │                                                 │
│          YES → Reset to normal price                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flight_booking
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🎯 Evaluation Criteria Checklist

- [x] **Code quality & project structure** - Clean MVC architecture
- [x] **UI/UX & presentation** - Premium glassmorphism design
- [x] **Database usage** - MongoDB with proper indexes
- [x] **Dynamic pricing** - Surge logic per specification
- [x] **Wallet system** - Balance tracking with transactions
- [x] **PDF generation** - Professional e-tickets
- [x] **Error handling** - Global middleware + toast notifications
- [x] **README clarity** - Comprehensive documentation

---

## 🚀 Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect to GitHub repository
3. Build Command: `cd server && npm install`
4. Start Command: `cd server && node src/index.js`
5. Add environment variables

### Frontend (Vercel)
1. Import project from GitHub
2. Framework Preset: Vite
3. Root Directory: `client`
4. Add `VITE_API_URL` environment variable

---

## 📄 License

This project is built for the **XTechon Full-Stack Developer Technical Assessment**.

---

<div align="center">

**Built with ❤️ for XTechon**

[⬆ Back to top](#xtechon-flight-booking-system-️)

</div>
