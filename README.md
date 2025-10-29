# 🚀 Taskly - Decentralized Freelance Marketplace

<div align="center">

**A modern, milestone-based freelance platform built with the MERN stack**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

[Live Demo](https://taskly-gold.vercel.app) · [Report Bug](https://github.com/manass3107/Taskly/issues) · [Request Feature](https://github.com/manass3107/Taskly/issues)

</div>

---

## 🌟 Overview

**Taskly** revolutionizes freelance collaboration by introducing a **trust-based milestone payment system**. Posters create tasks, workers submit competitive offers, and both parties collaborate through secure contracts with progressive payments.

### 💡 What Makes Taskly Different?

- **🛡️ Risk Mitigation**: Pay-as-you-go milestone system protects both parties
- **💰 Quality Assurance**: Workers pay a small participation fee (refunded if rejected) to ensure serious applications
- **🔄 Seamless Role Switching**: One account, multiple roles - be both a poster and a worker
- **📊 Complete Transparency**: Full transaction history and wallet integration
- **⚡ Real-time Updates**: Stay informed about offers, milestones, and payments

---

## ✨ Key Features

### 🔐 **Advanced Authentication & Authorization**
- JWT-based stateless authentication
- Role-based access control (Poster, Worker, Admin)
- Secure password hashing with bcrypt (10 salt rounds)
- Dynamic role switching without re-authentication

### 📝 **Task Management**
- Create tasks with detailed specifications (budget, deadline, component type)
- Automatic task expiration based on deadlines
- Filter by technology stack (Backend, Frontend, Full Stack, Database, Deployment)
- Rich task descriptions and requirements

### 💸 **Smart Offer System**
- Workers submit competitive offers with proposed fees
- **Participation fee mechanism** prevents spam applications
- Automatic refunds for rejected offers
- Real-time offer status tracking

### 🤝 **Contract & Milestone Engine**
- **Flexible payment terms**:
  - **Quarter**: 4 milestones at 25% each
  - **Half**: 2 milestones at 50% each  
  - **Full**: Single milestone at 100%
- Two-step approval process (request → review → approve)
- Milestone rejection with feedback mechanism
- Contract status tracking (Active, Completed, Cancelled)

### 💰 **Integrated Wallet System**
- In-app wallet with real-time balance updates
- Complete transaction history with audit trail
- Support for credits, debits, and top-ups
- Secure money transfers between users
- Transaction categorization (Funding, Payment, Refund)

### 🛡️ **Security Features**
- CORS protection with whitelisted origins
- JWT token verification on all protected routes
- Input sanitization and validation
- Secure API endpoints with proper error handling

---

## 📸 Screenshots

<details>
<summary>🔐 Authentication</summary>

### Login Page
![Login](https://taskly-gold.vercel.app/screenshots/Login.png)

### Signup Page
![Signup](https://taskly-gold.vercel.app/screenshots/Signup.png)

</details>

<details open>
<summary>🏠 Dashboard & Core Features</summary>

### Dashboard
![Dashboard](https://taskly-gold.vercel.app/screenshots/Dashboard.png)

### Create a Task
![Create a Task](https://taskly-gold.vercel.app/screenshots/Create%20a%20Task.png)

### Open Jobs
![Open Jobs](https://taskly-gold.vercel.app/screenshots/Open%20Jobs.png)

</details>

<details>
<summary>💼 Contracts & Payments</summary>

### Contract Details
![Contract Details](https://taskly-gold.vercel.app/screenshots/ContractDetails.png)

### Wallet
![Wallet](https://taskly-gold.vercel.app/screenshots/Wallet.png)

</details>

---

## 🏗️ Architecture

### Tech Stack

```
Frontend:  React.js + Tailwind CSS
Backend:   Node.js + Express.js
Database:  MongoDB + Mongoose ODM
Auth:      JWT + Bcrypt
Deployment: Vercel (Frontend) + Render (Backend)
```

### System Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React Client  │ ───► │  Express REST API │ ───► │   MongoDB       │
│   (Vercel)      │      │  (Railway/Render) │      │   (Atlas)       │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                          │                         │
        │                    ┌─────▼─────┐                  │
        │                    │    JWT    │                  │
        │                    │   Auth    │                  │
        │                    └───────────┘                  │
        │                                                   │
        └─────────────────── Secure HTTPS ─────────────────┘
```

### Data Models

```
User ──┬── Tasks (1:N)
       ├── Offers (1:N)
       ├── Contracts (1:N)
       └── Wallet (1:1, embedded)

Task ──┬── Offers (1:N)
       └── Contract (1:1)

Offer ──► Contract (N:1)

Contract ──► Milestones (1:N, embedded)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manass3107/Taskly.git
   cd Taskly
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   NODE_ENV=development
   ```

   Start backend server:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend/project
   npm install
   ```

   Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   Start frontend:
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

---

## 📖 Usage Guide

### 🎭 User Roles

| Role | Capabilities |
|------|-------------|
| **Poster** | Create tasks, review offers, accept contracts, release milestone payments |
| **Worker** | Browse tasks, submit offers, complete milestones, earn payments |
| **Admin** | Monitor system, resolve disputes *(coming soon)* |

### 🔄 Workflow

**Complete Task Journey:**

1. **Poster Creates Task** → Sets budget, deadline, participation fee
2. **Worker Browses & Applies** → Pays participation fee (refunded if rejected)
3. **Poster Reviews Offers** → Compares proposals from multiple workers
4. **Poster Accepts Offer** → Contract auto-generated with milestones
5. **Worker Completes Work** → Submits milestone for review
6. **Poster Approves** → Payment released automatically to worker's wallet
7. **Repeat for Each Milestone** → Progressive payment until completion
8. **Contract Completed** → Both parties have full transaction history

### 💡 Pro Tips

- **Role Switching**: Navigate to Profile → Switch Role to toggle between Poster and Worker
- **Wallet Management**: Top up your wallet before applying to tasks or accepting offers
- **Milestone Strategy**: Choose payment terms based on project complexity and trust level
- **Transaction History**: Review all wallet activities in the Wallet section

---

## 🎯 API Endpoints

<details>
<summary>View All Endpoints</summary>

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/open` - Get open tasks
- `POST /api/tasks` - Create new task (Poster only)
- `GET /api/tasks/my-tasks` - Get user's tasks
- `GET /api/tasks/:id` - Get task details

### Offers
- `POST /api/offers/:taskId/apply-offer` - Apply to task (Worker only)
- `GET /api/offers/task/:taskId` - Get offers for task
- `POST /api/offers/:offerId/accept` - Accept offer (Poster only)
- `POST /api/offers/:offerId/reject` - Reject offer (Poster only)

### Contracts
- `GET /api/contracts/my-contracts` - Get worker contracts
- `GET /api/contracts/my-posted-contracts` - Get poster contracts
- `GET /api/contracts/view/:contractId` - View contract details
- `POST /api/contracts/:contractId/milestones/:index/request-completion` - Request milestone approval
- `POST /api/contracts/:contractId/milestones/:index/approve` - Approve milestone
- `POST /api/contracts/:contractId/milestones/:index/reject` - Reject milestone

### Wallet
- `POST /api/users/topup` - Top up wallet
- `GET /api/users/transactions` - Get transaction history
- `GET /api/users/analytics` - Get dashboard analytics

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PATCH /api/users/switch-role` - Switch user role

</details>

---

## 🛠️ Technical Highlights

### Backend
- ✅ RESTful API design principles
- ✅ Mongoose ODM for elegant MongoDB modeling
- ✅ Embedded documents for wallet and milestones (optimized reads)
- ✅ JWT middleware for route protection
- ✅ Bcrypt password hashing with salt rounds
- ✅ CORS configuration for secure cross-origin requests
- ✅ Comprehensive error handling
- ✅ Transaction history with complete audit trail

### Frontend
- ✅ React functional components with hooks
- ✅ Tailwind CSS for responsive, modern UI
- ✅ Axios interceptors for global error handling
- ✅ LocalStorage for JWT token management
- ✅ Protected routes with authentication checks
- ✅ Real-time balance updates
- ✅ Dynamic role-based UI rendering

---

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and authorization
- [x] Task creation and management
- [x] Offer submission system
- [x] Contract and milestone engine
- [x] Wallet integration

### Phase 2: Enhancements 🚧
- [ ] MongoDB transactions for atomic payments
- [ ] Real-time notifications (Socket.io)
- [ ] File upload for milestone submissions
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Rating and review system

### Phase 3: Advanced Features 🔮
- [ ] Admin dashboard for dispute resolution
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Analytics and reporting
- [ ] Mobile application (React Native)
- [ ] AI-powered task matching
- [ ] Multi-currency support

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Manas Sharma**

- GitHub: [@manass3107](https://github.com/manass3107)
- Project Link: [https://github.com/manass3107/Taskly](https://github.com/manass3107/Taskly)
- Live Demo: [https://taskly-gold.vercel.app](https://taskly-gold.vercel.app)

---

## 🙏 Acknowledgments

- MongoDB for the excellent NoSQL database
- Express.js team for the minimalist web framework
- React team for the amazing UI library
- Node.js community for the robust runtime environment
- All open-source contributors who made this project possible

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Built with ❤️ by [@manass3107](https://github.com/manass3107)

</div>