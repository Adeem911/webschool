from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time

class Family(BaseModel):
    family_id: Optional[int] = None
    family_name: str
    address: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None

class Student(BaseModel):
    student_id: Optional[int] = None
    family_id: int
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    admission_date: date
    current_class: str
    section: Optional[str] = None
    status: Optional[str] = 'active'
    profile_picture: Optional[str] = None

class Subject(BaseModel):
    subject_id: Optional[int] = None
    subject_name: str
    subject_code: Optional[str] = None
    description: Optional[str] = None

class Class(BaseModel):
    class_id: Optional[int] = None
    class_name: str
    section: Optional[str] = None
    academic_year: str

class Teacher(BaseModel):
    teacher_id: Optional[int] = None
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    joining_date: Optional[date] = None

class Timetable(BaseModel):
    timetable_id: Optional[int] = None
    class_id: int
    subject_id: int
    teacher_id: int
    day_of_week: str
    start_time: time
    end_time: time
    room_number: Optional[str] = None

class Exam(BaseModel):
    exam_id: Optional[int] = None
    exam_name: str
    exam_date: date
    class_id: int
    subject_id: int
    total_marks: float
    passing_marks: float

class ExamResult(BaseModel):
    result_id: Optional[int] = None
    exam_id: int
    student_id: int
    marks_obtained: float
    grade: Optional[str] = None
    remarks: Optional[str] = None

class FeeStructure(BaseModel):
    fee_id: Optional[int] = None
    class_id: int
    fee_name: str
    amount: float
    frequency: str
    academic_year: str
    due_date: Optional[date] = None

class FeePayment(BaseModel):
    payment_id: Optional[int] = None
    family_id: int
    fee_id: int
    amount_paid: float
    payment_date: date
    payment_method: str
    transaction_reference: Optional[str] = None
    received_by: int
    remarks: Optional[str] = None

class Attendance(BaseModel):
    attendance_id: Optional[int] = None
    student_id: int
    date: date
    status: str
    remarks: Optional[str] = None
    recorded_by: int

class User(BaseModel):
    user_id: Optional[int] = None
    username: str
    password_hash: str
    role: str
    full_name: str
    email: Optional[str] = None