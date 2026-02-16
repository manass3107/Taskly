import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTaskPage from './pages/CreateTaskPage';
import Offers from './pages/Offers';
import AcceptOffer from './pages/AcceptOffer';
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
import LandingPage from './pages/LandingPage';

// Simple auth check wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Public route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CreateTaskPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Offers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TasksPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TaskDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId/offers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AcceptOffer />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Wallet />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-contracts"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyContracts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-posted-contracts"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyPostedContracts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-work"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyWork />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contract/:contractId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ContractDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyRequests />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/open-tasks"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TasksPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
