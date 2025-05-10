import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bounceIn, slideInFromRight } from '../utils/animations';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      formRef.current?.classList.add('loading');
      titleRef.current?.classList.add('loading');
      buttonRef.current?.classList.add('loading');
    } else {
      formRef.current?.classList.remove('loading');
      titleRef.current?.classList.remove('loading');
      buttonRef.current?.classList.remove('loading');
    }
  }, [loading]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a237e',
      }}
    >
      <Paper
        component="div"
        ref={formRef}
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          background: '#ffffff',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Typography 
          ref={titleRef} 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            color: '#1a237e',
            fontWeight: 700,
            mb: 3,
            letterSpacing: '0.5px',
          }}
        >
          Student Dashboard
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
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
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
                },
                '&:focus-within': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px 3px rgba(0, 0, 0, .15)',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#1a237e',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: '#1a237e',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#1a237e',
                fontWeight: 500,
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
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
                },
                '&:focus-within': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px 3px rgba(0, 0, 0, .15)',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#1a237e',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: '#1a237e',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#1a237e',
                fontWeight: 500,
              },
            }}
          />
          <Button
            ref={buttonRef}
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              background: '#1a237e',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#0d47a1',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 10px 4px rgba(26, 35, 126, .3)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 