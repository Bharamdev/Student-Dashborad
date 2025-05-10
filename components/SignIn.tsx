import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showNetworkStatus, setShowNetworkStatus] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Monitor network status changes
    const handleNetworkChange = () => {
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network.');
        setNetworkStatus('error');
        setShowNetworkStatus(true);
      }
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setNetworkStatus('loading');
    setShowNetworkStatus(true);

    try {
      const startTime = performance.now();
      await signInWithEmailAndPassword(auth, email, password);
      const endTime = performance.now();
      
      // Log network call details
      console.log('Firebase Auth Network Call:', {
        endpoint: 'signInWithEmailAndPassword',
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
        status: 'success'
      });

      setNetworkStatus('success');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/network-request-failed' 
        ? 'Network error. Please check your connection.'
        : 'Failed to sign in. Please check your credentials.';
      
      setError(errorMessage);
      setNetworkStatus('error');
      
      // Log error details
      console.error('Firebase Auth Error:', {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#121212',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 400,
          width: '100%',
          background: '#1e1e1e',
          borderRadius: { xs: 1, sm: 2 },
          position: 'relative',
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          align="center"
          gutterBottom
          sx={{
            color: '#ffffff',
            fontWeight: 600,
            mb: { xs: 2, sm: 4 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Sign In
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: { xs: 1.5, sm: 2 },
              background: '#1e1e1e',
              color: '#f44336',
              '& .MuiAlert-icon': {
                color: '#f44336',
              },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              mb: { xs: 1.5, sm: 2 },
              '& .MuiOutlinedInput-root': {
                background: '#2c2c2c',
                '& fieldset': {
                  borderColor: '#333',
                },
                '&:hover fieldset': {
                  borderColor: '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e88e5',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiInputBase-input': {
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              mb: { xs: 2, sm: 3 },
              '& .MuiOutlinedInput-root': {
                background: '#2c2c2c',
                '& fieldset': {
                  borderColor: '#333',
                },
                '&:hover fieldset': {
                  borderColor: '#1e88e5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e88e5',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiInputBase-input': {
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              background: '#1e88e5',
              color: '#ffffff',
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                background: '#1976d2',
              },
              '&:disabled': {
                background: '#1e88e5',
                opacity: 0.7,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={isMobile ? 20 : 24} sx={{ color: '#ffffff' }} />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Snackbar
          open={showNetworkStatus}
          autoHideDuration={6000}
          onClose={() => setShowNetworkStatus(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={networkStatus === 'error' ? 'error' : networkStatus === 'success' ? 'success' : 'info'}
            sx={{
              width: '100%',
              background: networkStatus === 'error' ? '#1e1e1e' : '#1e1e1e',
              color: networkStatus === 'error' ? '#f44336' : networkStatus === 'success' ? '#4caf50' : '#1e88e5',
              '& .MuiAlert-icon': {
                color: networkStatus === 'error' ? '#f44336' : networkStatus === 'success' ? '#4caf50' : '#1e88e5',
              },
            }}
          >
            {networkStatus === 'loading' && 'Connecting to Firebase...'}
            {networkStatus === 'success' && 'Successfully connected to Firebase'}
            {networkStatus === 'error' && 'Failed to connect to Firebase'}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default SignIn; 