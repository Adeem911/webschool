export interface Family {
  family_id?: number;
  family_name: string;
  address?: string;
  contact_number?: string;
  email?: string;
}

export interface Student {
  student_id?: number;
  family_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  admission_date: string;
  current_class: string;
  section?: string;
  status?: string;
  profile_picture?: string;
}

export interface FeePayment {
  payment_id?: number;
  family_id: number;
  fee_id: number;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  transaction_reference?: string;
  received_by: number;
  remarks?: string;
  fee_name?: string;
  fee_amount?: number;
  frequency?: string;
  received_by_name?: string;
}

export interface ExamResult {
  result_id?: number;
  exam_id: number;
  student_id: number;
  marks_obtained: number;
  grade?: string;
  remarks?: string;
  exam_name?: string;
  exam_date?: string;
  subject_name?: string;
  total_marks?: number;
  passing_marks?: number;
}

export interface TimetableEntry {
  timetable_id?: number;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number?: string;
  subject_name?: string;
  teacher_first_name?: string;
  teacher_last_name?: string;
}

export interface AttendanceRecord {
  attendance_id?: number;
  student_id: number;
  date: string;
  status: string;
  remarks?: string;
  recorded_by: number;
  recorded_by_name?: string;
}

// types.ts
export interface Exam {
  exam_id: number
  exam_name: string
  exam_date: string
  class_id: number
  subject_id: number
  subject_name: string
  total_marks: number
  passing_marks: number
}

// types.ts
export interface Family {
  family_id: number
  family_name: string
  contact_number?: string
  email?: string
  label?: string // ← Add this if you need a display label
}

