import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addStudent } from '../services/mockApi';
import { useAuth } from '../contexts/AuthContext';

const courses = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'];
const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
const performanceLevels = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];

interface FormData {
  name: string;
  grade: string;
  attendance: string;
  performance: string;
  course: string;
}

interface FormErrors {
  name?: string;
  grade?: string;
  attendance?: string;
  performance?: string;
  course?: string;
}

const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    grade: '',
    attendance: '',
    performance: '',
    course: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.course) {
      newErrors.course = 'Course is required';
    }

    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    }

    if (!formData.attendance) {
      newErrors.attendance = 'Attendance is required';
    } else {
      const attendance = Number(formData.attendance);
      if (isNaN(attendance) || attendance < 0 || attendance > 100) {
        newErrors.attendance = 'Attendance must be between 0 and 100';
      }
    }

    if (!formData.performance) {
      newErrors.performance = 'Performance is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user makes a selection
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Please login to add students',
        severity: 'error',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await addStudent({
        ...formData,
        attendance: Number(formData.attendance),
      });
      setSnackbar({
        open: true,
        message: 'Student added successfully',
        severity: 'success',
      });
      setTimeout(() => navigate('/students'), 1500);
    } catch (error) {
      console.error('Error adding student:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add student',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Box sx={{ p: 3, background: '#121212', minHeight: '100vh' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          color: '#ffffff',
          fontWeight: 600,
        }}
      >
        Add New Student
      </Typography>
      <Paper
        sx={{
          p: 4,
          background: '#1e1e1e',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                sx={{
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
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ffffff' }}>
                  Course
                </InputLabel>
                <Select
                  name="course"
                  value={formData.course}
                  onChange={handleSelectChange}
                  required
                  sx={{
                    background: '#2c2c2c',
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    },
                  }}
                >
                  {courses.map((course) => (
                    <MenuItem 
                      key={course} 
                      value={course}
                      sx={{
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#2c2c2c',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#1e88e5',
                          '&:hover': {
                            backgroundColor: '#1976d2',
                          },
                        },
                      }}
                    >
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ffffff' }}>
                  Grade
                </InputLabel>
                <Select
                  name="grade"
                  value={formData.grade}
                  onChange={handleSelectChange}
                  required
                  sx={{
                    background: '#2c2c2c',
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    },
                  }}
                >
                  {grades.map((grade) => (
                    <MenuItem 
                      key={grade} 
                      value={grade}
                      sx={{
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#2c2c2c',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#1e88e5',
                          '&:hover': {
                            backgroundColor: '#1976d2',
                          },
                        },
                      }}
                    >
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Attendance"
                name="attendance"
                type="number"
                value={formData.attendance}
                onChange={handleChange}
                error={!!errors.attendance}
                helperText={errors.attendance}
                required
                InputProps={{
                  inputProps: { min: 0, max: 100 }
                }}
                sx={{
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
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ffffff' }}>
                  Performance
                </InputLabel>
                <Select
                  name="performance"
                  value={formData.performance}
                  onChange={handleSelectChange}
                  required
                  sx={{
                    background: '#2c2c2c',
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    },
                  }}
                >
                  {performanceLevels.map((level) => (
                    <MenuItem 
                      key={level} 
                      value={level}
                      sx={{
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#2c2c2c',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#1e88e5',
                          '&:hover': {
                            backgroundColor: '#1976d2',
                          },
                        },
                      }}
                    >
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/students')}
                  disabled={loading}
                  sx={{
                    color: '#ffffff',
                    borderColor: '#ffffff',
                    '&:hover': {
                      borderColor: '#1e88e5',
                      color: '#1e88e5',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{
                    background: '#1e88e5',
                    color: '#ffffff',
                    '&:hover': {
                      background: '#1976d2',
                    },
                  }}
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            background: '#1e1e1e',
            color: '#ffffff',
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'success' ? '#4caf50' : '#f44336',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddStudent; 