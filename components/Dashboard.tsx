import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      icon: <PeopleIcon sx={{ fontSize: isMobile ? 30 : 40, color: '#1e88e5' }} />,
      color: '#1e88e5',
    },
    {
      title: 'Active Courses',
      value: '12',
      icon: <SchoolIcon sx={{ fontSize: isMobile ? 30 : 40, color: '#4caf50' }} />,
      color: '#4caf50',
    },
    {
      title: 'Average Grade',
      value: 'B+',
      icon: <TrendingUpIcon sx={{ fontSize: isMobile ? 30 : 40, color: '#ff9800' }} />,
      color: '#ff9800',
    },
    {
      title: 'Assignments Due',
      value: '5',
      icon: <AssignmentIcon sx={{ fontSize: isMobile ? 30 : 40, color: '#f44336' }} />,
      color: '#f44336',
    },
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      background: '#121212', 
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"}
        component="h1" 
        gutterBottom
        sx={{
          color: '#ffffff',
          fontWeight: 600,
          mb: { xs: 2, sm: 4 },
          fontSize: { xs: '1.5rem', sm: '2rem' },
          wordBreak: 'break-word',
        }}
      >
        Welcome back, {currentUser?.email}
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                background: '#1e1e1e',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                {stat.icon}
              </Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"}
                component="div"
                sx={{
                  color: stat.color,
                  fontWeight: 600,
                  mb: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1.25rem', sm: '2rem' },
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                variant="body1"
                sx={{
                  color: '#ffffff',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              background: '#1e1e1e',
              height: '100%',
              borderRadius: { xs: 1, sm: 2 },
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"}
              component="h2"
              sx={{
                color: '#ffffff',
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 600,
              }}
            >
              Recent Activity
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              background: '#1e1e1e',
              height: '100%',
              borderRadius: { xs: 1, sm: 2 },
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"}
              component="h2"
              sx={{
                color: '#ffffff',
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 600,
              }}
            >
              Upcoming Events
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              No upcoming events to display.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 