# 🚀 Taskly

**Taskly** is a decentralized task marketplace where **posters** create tasks, **workers** apply offers, and both collaborate via contracts, milestones, and wallet integration.

> Built with **MERN Stack** — MongoDB, Express, React, Node.js.

---

## ✨ Features

- 🔐 Role-based authentication: `poster`, `worker`, and `admin`
- 📝 Posters create tasks with budget, deadline & component type
- 💸 Workers apply with proposed fee & message
- 🤝 Posters accept offers → generate contracts
- 📜 Contract Milestones: quarter / half / full payments
- 💰 In-app Wallet System: top-up, debits, credits, history
- 🔁 RESTful backend with JWT auth & secure routes

---

## 🖼️ Preview

> _(Screenshots folder: `/frontend/public/screenshots`)_

![Dashboard](./screenshots/dashboard.png)
![Wallet](./screenshots/wallet.png)

---

## 🧠 Tech Stack

| Frontend   | Backend    | Database | Auth          |
|------------|------------|----------|---------------|
| React.js   | Express.js | MongoDB  | JWT + Bcrypt  |

---

## 📁 Project Structure

Taskly/
├── frontend/ # React app
├── backend/ # Express + MongoDB server
├── README.md
├── LICENSE

---

## ⚙️ Getting Started

### 1. Clone the repo

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

bash
Copy
Edit
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
