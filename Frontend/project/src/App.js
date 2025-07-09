import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTaskPage from './pages/CreateTaskPage';
import Offers from './pages/Offers';
import AcceptOffer from './pages/AcceptOffer';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import Wallet from './pages/Wallet';
import TasksPage from './pages/TasksPage';
import DashboardLayout from './pages/DashboardLayout';
import MyRequests from './pages/MyRequests';
import MyContracts from './pages/MyContracts';
import MyPostedContracts from './pages/MyPostedContracts';
import MyWork from './pages/MyWork';
import ContractDetails from './pages/ContractDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (with layout including Navbar + user info) */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/create-task"
          element={
            <DashboardLayout>
              <CreateTaskPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/offers"
          element={
            <DashboardLayout>
              <Offers />
            </DashboardLayout>
          }
        />
        <Route
          path="/tasks"
          element={
            <DashboardLayout>
              <TasksPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <DashboardLayout>
              <TaskDetail />
            </DashboardLayout>
          }
        />
        <Route
          path="/tasks/:taskId/offers"
          element={
            <DashboardLayout>
              <AcceptOffer />
            </DashboardLayout>
          }
        />
        <Route
          path="/wallet"
          element={
            <DashboardLayout>
              <Wallet />
            </DashboardLayout>
          }
        />
        <Route
          path="/my-contracts"
          element={
            <DashboardLayout>
              <MyContracts />
            </DashboardLayout>
          }
        />
        <Route
          path="/my-posted-contracts"
          element={
            <DashboardLayout>
              <MyPostedContracts />
            </DashboardLayout>
          }
        />
        <Route
          path="/my-work"
          element={
            <DashboardLayout>
              <MyWork />
            </DashboardLayout>
          }
        />
        <Route
          path="/contract/:contractId"
          element={
            <DashboardLayout>
              <ContractDetails />
            </DashboardLayout>
          }
        />
        <Route
          path="/my-requests"
          element={
            <DashboardLayout>
              <MyRequests />
            </DashboardLayout>
          }
        />
        <Route
          path="/open-tasks"
          element={
            <DashboardLayout>
              <TasksPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />


      </Routes>
    </Router>
  );
}

export default App;
