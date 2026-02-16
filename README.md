# 🚀 Taskly - Modern Freelance Marketplace

<div align="center">

**A modern, milestone-based freelance platform with a clean, intuitive interface**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

[Live Demo](https://taskly-gold.vercel.app) · [Report Bug](https://github.com/manass3107/Taskly/issues) · [Request Feature](https://github.com/manass3107/Taskly/issues)

</div>

---

## 🌟 Overview

**Taskly** revolutionizes freelance collaboration by introducing a **trust-based milestone payment system** with a beautiful, modern interface. Users can create tasks, submit competitive offers, and collaborate through secure contracts with progressive payments - all in one unified account.

### 💡 What Makes Taskly Different?

- **🎨 Clean Modern UI**: Beautiful light theme with intuitive navigation and smooth animations
- **🛡️ Risk Mitigation**: Pay-as-you-go milestone system protects both parties
- **💰 Quality Assurance**: Participation fee mechanism ensures serious applications
- **🔄 Unified Account**: One account for all activities - post tasks, work on tasks, manage contracts
- **📊 Complete Transparency**: Full transaction history and integrated wallet system
- **⚡ Real-time Updates**: Stay informed about offers, milestones, and payments

---

## ✨ Key Features

### 🎨 **Modern User Interface**
- Clean, light theme with professional aesthetics
- Responsive design that works on all devices
- Smooth animations and transitions
- Intuitive navigation with clear visual hierarchy
- Beautiful landing page showcasing platform benefits

### 🔐 **Secure Authentication**
- JWT-based stateless authentication
- Secure password hashing with bcrypt (10 salt rounds)
- Protected routes and API endpoints
- Session management with token refresh

### 📝 **Smart Task Management**
- Create tasks with detailed specifications (budget, deadline, technology stack)
- Filter by component type (Backend, Frontend, Full Stack, Database, Deployment)
- Automatic task status tracking
- Rich task descriptions with markdown support
- View all your posted tasks in one place

### 💸 **Intelligent Offer System**
- Submit competitive offers with custom proposals
- **Participation fee mechanism** prevents spam applications
- Automatic refunds for rejected offers
- Real-time offer status tracking
- Compare multiple offers side-by-side

### 🤝 **Contract & Milestone Engine**
- **Flexible payment terms**:
  - **Quarter**: 4 milestones at 25% each
  - **Half**: 2 milestones at 50% each  
  - **Full**: Single milestone at 100%
- Two-step approval process (request → review → approve)
- Milestone rejection with feedback mechanism
- Contract status tracking (Active, Completed, Cancelled)
- Visual milestone progress tracking

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
- Environment-based configuration

---

## 📸 Screenshots

<details>
<summary>🎨 Landing Page</summary>

### Welcome Page
Beautiful landing page showcasing Taskly's features and benefits with modern design.

![Welcome Page](https://taskly-gold.vercel.app/screenshots/Welcome%20page.png)

</details>

<details>
<summary>🔐 Authentication</summary>

### Login Page
Clean login interface with email and password authentication.

![Login](https://taskly-gold.vercel.app/screenshots/Login.png)

### Signup Page
User registration with name, email, and password fields.

![Signup](https://taskly-gold.vercel.app/screenshots/Signup.png)

</details>

<details open>
<summary>🏠 Dashboard & Core Features</summary>

### Dashboard
Comprehensive dashboard showing user statistics, wallet balance, and quick action cards.

![Dashboard](https://taskly-gold.vercel.app/screenshots/Dashboard.png)

### Create a Task
Intuitive task creation form with budget, deadline, and technology stack specification.

![Create a Task](https://taskly-gold.vercel.app/screenshots/Create%20a%20Task.png)

### Open Jobs
Browse all available tasks with filtering options by component type.

![Open Jobs](https://taskly-gold.vercel.app/screenshots/Open%20Jobs.png)

</details>

<details>
<summary>💼 Contracts & Payments</summary>

### Contract Details
View contract milestones, payment terms, and approve/request milestone completion.

![Contract Details](https://taskly-gold.vercel.app/screenshots/Contract%20Details.png)

### Wallet
Integrated wallet showing current balance and complete transaction history.

![Wallet](https://taskly-gold.vercel.app/screenshots/Wallet.png)

</details>

---

## 🏗️ Architecture

### Tech Stack

```
Frontend:  React.js + Tailwind CSS + Framer Motion
Backend:   Node.js + Express.js
Database:  MongoDB + Mongoose ODM
Auth:      JWT + Bcrypt
Deployment: Vercel (Frontend) + Render (Backend)
```

### System Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React Client  │ ───► │  Express REST API │ ───► │   MongoDB       │
│   (Vercel)      │      │  (Render)         │      │   (Atlas)       │
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
   cd Backend
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
   cd ../Frontend/project
   npm install
   ```

   Create `.env` file:
   ```env
   REACT_APP_API=http://localhost:5000
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

### 🔄 Complete Workflow

**Task Journey from Creation to Completion:**

1. **Create a Task** 
   - Navigate to Dashboard → Create Task
   - Fill in task details (title, description, budget, deadline)
   - Set participation fee and choose payment terms (Quarter/Half/Full)
   - Submit to make it visible to all users

2. **Browse & Apply to Tasks**
   - Visit "Open Tasks" to see available opportunities
   - Review task details, budget, and requirements
   - Submit an offer with your proposed fee and message
   - Pay the participation fee (refunded if rejected)

3. **Review Offers (Task Poster)**
   - Go to "My Requests" to see your posted tasks
   - Click on a task to view all received offers
   - Compare proposals, fees, and applicant profiles
   - Accept the best offer or reject others

4. **Contract Begins**
   - System automatically creates a contract upon acceptance
   - Milestones are generated based on selected payment terms
   - Both parties receive notifications
   - View contract details in "My Work" or "My Contracts"

5. **Complete Milestones**
   - Worker completes work for a milestone
   - Worker requests milestone completion
   - Poster reviews the work
   - Poster approves or rejects with feedback
   - Payment automatically transfers to worker's wallet upon approval

6. **Project Completion**
   - Repeat for all milestones
   - Contract marked as completed when all milestones done
   - Full transaction history available in Wallet
   - Both parties can view contract details anytime

### 💡 Pro Tips

- **Wallet Management**: Always maintain sufficient balance before posting tasks or applying to them
- **Clear Descriptions**: Provide detailed task descriptions to attract quality offers
- **Milestone Strategy**: Choose payment terms based on project complexity and budget
- **Transaction History**: Review all wallet activities in the Wallet section for complete transparency
- **Profile Setup**: Complete your profile to build credibility with other users

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
- `POST /api/tasks` - Create new task
- `GET /api/tasks/my-tasks` - Get user's posted tasks
- `GET /api/tasks/:id` - Get task details

### Offers
- `POST /api/offers/:taskId/apply-offer` - Apply to task
- `GET /api/offers/task/:taskId` - Get offers for task
- `POST /api/offers/:offerId/accept` - Accept offer
- `POST /api/offers/:offerId/reject` - Reject offer

### Contracts
- `GET /api/contracts/my-contracts` - Get contracts where user is worker
- `GET /api/contracts/my-posted-contracts` - Get contracts where user is poster
- `GET /api/contracts/view/:contractId` - View contract details
- `POST /api/contracts/:contractId/milestones/:index/request-completion` - Request milestone approval
- `POST /api/contracts/:contractId/milestones/:index/approve` - Approve milestone
- `POST /api/contracts/:contractId/milestones/:index/reject` - Reject milestone
- `POST /api/contracts/:contractId/complete` - Mark contract as completed

### Wallet
- `POST /api/users/topup` - Top up wallet
- `GET /api/users/transactions` - Get transaction history
- `GET /api/users/analytics` - Get dashboard analytics

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

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
- ✅ Comprehensive error handling and validation
- ✅ Transaction history with complete audit trail

### Frontend
- ✅ React functional components with hooks
- ✅ **Clean light theme** with consistent design system
- ✅ Tailwind CSS for responsive, modern UI
- ✅ Framer Motion for smooth animations
- ✅ Axios for API communication
- ✅ LocalStorage for JWT token management
- ✅ Protected routes with authentication checks
- ✅ Real-time balance updates
- ✅ Responsive design for mobile and desktop

---

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and authorization
- [x] Task creation and management
- [x] Offer submission system
- [x] Contract and milestone engine
- [x] Wallet integration
- [x] Clean, modern UI with light theme

### Phase 2: Enhancements 🚧
- [ ] MongoDB transactions for atomic payments
- [ ] Real-time notifications (Socket.io)
- [ ] File upload for milestone submissions
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Rating and review system

### Phase 3: Advanced Features 🔮
- [ ] Dispute resolution system
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Analytics and reporting dashboard
- [ ] Mobile application (React Native)
- [ ] AI-powered task matching
- [ ] Multi-currency support
- [ ] Dark mode toggle

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
- Tailwind CSS for the utility-first CSS framework
- Node.js community for the robust runtime environment
- All open-source contributors who made this project possible

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Built with ❤️ by [@manass3107](https://github.com/manass3107)

</div>