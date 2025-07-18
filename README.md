# 🚀 Taskly

**Taskly** is a decentralized task marketplace where **posters** create tasks, **workers** apply with offers, and both collaborate via **contracts**, **milestones**, and **wallet integration**.

> Built with **MERN Stack** — MongoDB, Express, React, Node.js.

---

## ✨ Features

- 🔐 Role-based authentication: `poster`, `worker`, and `admin`
- 📝 Posters create tasks with budget, deadline & component type
- 💸 Workers apply with proposed fee & message
- 🤝 Posters accept offers → generate contracts
- 📜 Contract milestones: quarter / half / full payments
- 💰 In-app wallet system: top-up, debits, credits, history
- 🔁 RESTful backend with JWT authentication & secure routes

---

## 📸 Screenshots

### 🔐 Login Page
![Login](https://taskly-gold.vercel.app/screenshots/Login.png)

### 📝 Signup Page
![Signup](https://taskly-gold.vercel.app/screenshots/Signup.png)

### 🏠 Dashboard
![Dashboard](https://taskly-gold.vercel.app/screenshots/Dashboard.png)

### 📌 Create a Task
![Create a Task](https://taskly-gold.vercel.app/screenshots/Create%20a%20Task.png)

### 📂 Open Jobs
![Open Jobs](https://taskly-gold.vercel.app/screenshots/Open%20Jobs.png)

### 💼 Contract Details
![Contract Details](https://taskly-gold.vercel.app/screenshots/ContractDetails.png)

### 💰 Wallet
![Wallet](https://taskly-gold.vercel.app/screenshots/Wallet.png)

---

## 🧠 Tech Stack

| Frontend   | Backend    | Database | Authentication |
|------------|------------|----------|----------------|
| React.js   | Express.js | MongoDB  | JWT + Bcrypt   |

---

## 📁 Project Structure



Taskly/
├── frontend/ # React app
├── backend/ # Express + MongoDB server
├── README.md
└── LICENSE

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/manass3107/Taskly.git
cd Taskly

2. Setup Backend

cd backend
npm install


Create a .env file:
env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Start the backend server:
npm start



3. Setup Frontend

cd ../frontend
npm install
npm start



👤 Default Roles (Demo)
Role	Abilities
Poster	Create tasks, accept offers, fund contracts
Worker	Apply to tasks, complete milestones
Admin	(Coming soon)



🧪 Sample Users
After signup, switch roles via the profile page

Try both poster and worker flows

Seamless role toggle without separate logins



💼 Wallet System
Credit-based top-up system (for testing only)

Posters pay participation fees when accepting offers

Workers see transaction history under Wallet tab



📜 License
This project is licensed under the MIT License — see LICENSE for details.



🤝 Contributing
Pull requests are welcome!
Fork the repo, make improvements, and open a PR.
Feel free to open issues for bugs or suggestions.

📬 Contact
Built with ❤️ by @manass3107
