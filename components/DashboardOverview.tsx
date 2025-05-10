import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  SvgIconProps,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<SvgIconProps>;
  color: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, progress }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: '#1e1e1e',
        border: '1px solid #333',
        '&:hover': {
          borderColor: color,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#ffffff' }}>
            {title}
          </Typography>
          <Box 
            sx={{ 
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color } })}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold', color: '#ffffff' }}>
          {value}
        </Typography>
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#333',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: color,
                },
              }}
            />
            <Typography variant="body2" sx={{ mt: 0.5, color: '#ffffff' }}>
              {progress}% Complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardOverview: React.FC = () => {
  useEffect(() => {
    // Clear network cache when component mounts
    const clearCache = async () => {
      try {
        // Clear browser cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        }

        // Clear service worker cache if exists
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        }

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Clear IndexedDB
        const databases = await window.indexedDB.databases();
        databases.forEach(db => {
          if (db.name) window.indexedDB.deleteDatabase(db.name);
        });

        console.log('Cache cleared successfully');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    };

    clearCache();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: '#ffffff',
          }}
        >
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Students"
              value={150}
              icon={<PeopleIcon />}
              color="#1e88e5"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Courses"
              value={12}
              icon={<SchoolIcon />}
              color="#1e88e5"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Grade"
              value="85%"
              icon={<GradeIcon />}
              color="#1e88e5"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Assignments Due"
              value={8}
              icon={<AssignmentIcon />}
              color="#1e88e5"
              progress={60}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardOverview; 