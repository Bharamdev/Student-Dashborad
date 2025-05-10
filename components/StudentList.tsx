import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent } from '../services/mockApi';
import { useAuth } from '../contexts/AuthContext';

interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  performance: string;
  course: string;
}

const courses = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'];

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.performance.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * modifier;
        }
        return 0;
      });
  }, [students, searchTerm, sortField, sortDirection]);

  const paginatedStudents = useMemo(() => {
    return filteredAndSortedStudents.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredAndSortedStudents, page, rowsPerPage]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await getStudents(selectedCourse || undefined);
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedCourse]);

  const handleDelete = async (id: string) => {
    if (!currentUser) {
      alert('Please login to delete students');
      return;
    }
    try {
      await deleteStudent(id);
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleCourseChange = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSort = (field: keyof Student) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getGradeColor = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      'A': theme.palette.success.main,
      'A-': theme.palette.success.main,
      'B+': theme.palette.info.main,
      'B': theme.palette.info.main,
      'B-': theme.palette.info.main,
      'C+': theme.palette.warning.main,
      'C': theme.palette.warning.main,
      'C-': theme.palette.warning.main,
      'D+': theme.palette.error.main,
      'D': theme.palette.error.main,
      'F': theme.palette.error.main,
    };
    return gradeColors[grade] || theme.palette.text.primary;
  };

  return (
    <Box sx={{ p: 3, background: '#121212', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          Student List
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (!currentUser) {
              alert('Please login to add students');
              return;
            }
            navigate('/add-student');
          }}
          sx={{
            background: '#1e88e5',
            color: '#ffffff',
            '&:hover': {
              background: '#1976d2',
            },
          }}
        >
          Add New Student
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search Students"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#ffffff' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: '#1e1e1e',
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
            '& .MuiInputBase-input': {
              color: '#ffffff',
            },
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: '#ffffff' }}>
            Filter by Course
          </InputLabel>
          <Select
            value={selectedCourse}
            label="Filter by Course"
            onChange={handleCourseChange}
            sx={{
              background: '#1e1e1e',
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
            <MenuItem value="">All Courses</MenuItem>
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
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          background: '#1e1e1e',
          '& .MuiTableHead-root': {
            background: '#2c2c2c',
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: '#1e88e5' }} />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                      <Typography sx={{ fontWeight: 600, color: '#ffffff' }}>Name</Typography>
                      <SortIcon sx={{ ml: 1, opacity: sortField === 'name' ? 1 : 0.3, color: '#ffffff' }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('course')}>
                      <Typography sx={{ fontWeight: 600, color: '#ffffff' }}>Course</Typography>
                      <SortIcon sx={{ ml: 1, opacity: sortField === 'course' ? 1 : 0.3, color: '#ffffff' }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('grade')}>
                      <Typography sx={{ fontWeight: 600, color: '#ffffff' }}>Grade</Typography>
                      <SortIcon sx={{ ml: 1, opacity: sortField === 'grade' ? 1 : 0.3, color: '#ffffff' }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('attendance')}>
                      <Typography sx={{ fontWeight: 600, color: '#ffffff' }}>Attendance</Typography>
                      <SortIcon sx={{ ml: 1, opacity: sortField === 'attendance' ? 1 : 0.3, color: '#ffffff' }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('performance')}>
                      <Typography sx={{ fontWeight: 600, color: '#ffffff' }}>Performance</Typography>
                      <SortIcon sx={{ ml: 1, opacity: sortField === 'performance' ? 1 : 0.3, color: '#ffffff' }} />
                    </Box>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: '#2c2c2c',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ color: '#ffffff' }}>
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#ffffff' }}>
                        {student.course}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.grade}
                        size="small"
                        sx={{
                          backgroundColor: `${getGradeColor(student.grade)}15`,
                          color: getGradeColor(student.grade),
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 4,
                            backgroundColor: '#1e88e5',
                            borderRadius: 2,
                            mr: 1,
                          }}
                        />
                        <Typography sx={{ color: '#ffffff' }}>{student.attendance}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#ffffff' }}>{student.performance}</Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            if (!currentUser) {
                              alert('Please login to edit students');
                              return;
                            }
                            navigate(`/edit-student/${student.id}`);
                          }}
                          sx={{ color: '#1e88e5' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(student.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAndSortedStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                background: '#1e1e1e',
                color: '#ffffff',
                '& .MuiTablePagination-select': {
                  color: '#ffffff',
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  color: '#ffffff',
                },
              }}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default StudentList; 