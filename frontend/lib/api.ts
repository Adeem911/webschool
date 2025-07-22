import type { Family, Student, FeePayment, Exam, ExamResult, TimetableEntry, AttendanceRecord } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text(); // <-- change here
    console.error("Backend error response:", errorText); // log full text
    throw new Error('An error occurred while fetching data');
  }
  return await response.json();
};




export const fetchFamilies = async (): Promise<Family[]> => {
  const response = await fetch(`${API_BASE_URL}/families`);
  return await handleResponse(response);
};

export const fetchFamily = async (familyId: number): Promise<Family> => {
  const response = await fetch(`${API_BASE_URL}/families/${familyId}`);
  return await handleResponse(response);
};

export const createFamily = async (familyData: Family): Promise<Family> => {
  const response = await fetch(`${API_BASE_URL}/families`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(familyData),
  });
  return await handleResponse(response);
};

export const updateFamily = async (familyId: number, familyData: Family): Promise<Family> => {
  const response = await fetch(`${API_BASE_URL}/families/${familyId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(familyData),
  });
  return await handleResponse(response);
};

export const deleteFamily = async (familyId: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/families/${familyId}`, {
    method: 'DELETE',
  });
  return await handleResponse(response);
};

export const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${API_BASE_URL}/students`);
  return await handleResponse(response);
};

export const fetchStudent = async (studentId: number): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
  return await handleResponse(response);
};

export const createStudent = async (studentData: Student): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  return await handleResponse(response);
};

export const updateStudent = async (studentId: number, studentData: Student): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  return await handleResponse(response);
};

export const deleteStudent = async (studentId: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: 'DELETE',
  });
  return await handleResponse(response);
};

export const fetchFamilyPayments = async (familyId: number): Promise<FeePayment[]> => {
  const response = await fetch(`${API_BASE_URL}/families/${familyId}/payments`);
  return await handleResponse(response);
};

export const createPayment = async (familyId: number, paymentData: FeePayment): Promise<FeePayment> => {
  const response = await fetch(`${API_BASE_URL}/families/${familyId}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });
  return await handleResponse(response);
};

export const fetchStudentResults = async (studentId: number): Promise<ExamResult[]> => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/results`);
  return await handleResponse(response);
};

export const fetchClassTimetable = async (className: string): Promise<TimetableEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/timetable/class/${className}`);
  return await handleResponse(response);
};

export const fetchStudentAttendance = async (studentId: number): Promise<AttendanceRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/attendance`);
  return await handleResponse(response);
};

export const fetchExams = async (): Promise<Exam[]> => {
  const response = await fetch(`${API_BASE_URL}/exams`);
  return await handleResponse(response);
};

export const fetchExam = async (examId: number): Promise<Exam> => {
  const response = await fetch(`${API_BASE_URL}/exams/${examId}`);
  return await handleResponse(response);
};

export const fetchExamResults = async (examId: number): Promise<ExamResult[]> => {
  const response = await fetch(`${API_BASE_URL}/exams/${examId}/results`);
  return await handleResponse(response);
};

export const updateExam = async (examId: number, examData: Exam): Promise<Exam> => {
  const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(examData),
  });
  return await handleResponse(response);
};

export const deleteExam = async (examId: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
    method: 'DELETE',
  });
  return await handleResponse(response);
};
