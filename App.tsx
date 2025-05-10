import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Login from './components/Login';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import DashboardOverview from './components/DashboardOverview';
import { useAuth } from './contexts/AuthContext';
import { darkTheme } from './theme/darkTheme';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardOverview />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Layout>
                  <StudentList />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/add-student"
            element={
              <PrivateRoute>
                <Layout>
                  <AddStudent />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 