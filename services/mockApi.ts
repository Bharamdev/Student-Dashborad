import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  performance: string;
  course: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    grade: 'A',
    attendance: 95,
    performance: 'Excellent',
    course: 'Computer Science'
  },
  {
    id: '2',
    name: 'Jane Smith',
    grade: 'B+',
    attendance: 88,
    performance: 'Good',
    course: 'Mathematics'
  }
];

const mock = new MockAdapter(axios, { delayResponse: 1000 });

// Get all students
mock.onGet('/api/students').reply(200, mockStudents);

// Add new student
mock.onPost('/api/students').reply((config) => {
  const newStudent = JSON.parse(config.data);
  newStudent.id = Date.now().toString();
  mockStudents.push(newStudent);
  return [201, newStudent];
});

// Delete student
mock.onDelete(/\/api\/students\/.*/).reply((config) => {
  const id = config.url?.split('/').pop();
  const index = mockStudents.findIndex(student => student.id === id);
  if (index !== -1) {
    mockStudents.splice(index, 1);
    return [200, { message: 'Student deleted successfully' }];
  }
  return [404, { message: 'Student not found' }];
});

// Filter students by course
mock.onGet(/\/api\/students\?course=.*/).reply((config) => {
  const course = new URLSearchParams(config.url?.split('?')[1]).get('course');
  const filteredStudents = mockStudents.filter(student => student.course === course);
  return [200, filteredStudents];
});

export const api = axios.create();

export const getStudents = async (course?: string): Promise<Student[]> => {
  const url = course ? `/api/students?course=${course}` : '/api/students';
  const response = await api.get(url);
  return response.data;
};

export const addStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  const response = await api.post('/api/students', student);
  return response.data;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await api.delete(`/api/students/${id}`);
}; 