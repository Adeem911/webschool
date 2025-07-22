CREATE DATABASE student_portal;

USE student_portal;

-- Family table (for fee management)
CREATE TABLE families (
    family_id INT AUTO_INCREMENT PRIMARY KEY,
    family_name VARCHAR(100) NOT NULL,
    address TEXT,
    contact_number VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for system users/admins)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'staff') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    admission_date DATE NOT NULL,
    current_class VARCHAR(20) NOT NULL,
    section VARCHAR(20),
    status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
    profile_picture VARCHAR(255),
    FOREIGN KEY (family_id) REFERENCES families(family_id)
);

-- Subjects table
CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(50) NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    description TEXT
);

-- Classes table
CREATE TABLE classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(20) NOT NULL,
    section VARCHAR(20),
    academic_year VARCHAR(20) NOT NULL
);

-- Class-Subject mapping
CREATE TABLE class_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- Teachers table
CREATE TABLE teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    qualification TEXT,
    specialization VARCHAR(100),
    joining_date DATE
);

-- Timetable table
CREATE TABLE timetable (
    timetable_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Exams table
CREATE TABLE exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    exam_date DATE NOT NULL,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    passing_marks DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- Exam results table
CREATE TABLE exam_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    grade VARCHAR(2),
    remarks TEXT,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Fees structure table
CREATE TABLE fee_structure (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    fee_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency ENUM('monthly', 'quarterly', 'half-yearly', 'yearly', 'one-time') NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    due_date DATE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

-- Fee payments table
CREATE TABLE fee_payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    fee_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'cheque', 'bank_transfer', 'online') NOT NULL,
    transaction_reference VARCHAR(100),
    received_by INT NOT NULL,
    remarks TEXT,
    FOREIGN KEY (family_id) REFERENCES families(family_id),
    FOREIGN KEY (fee_id) REFERENCES fee_structure(fee_id),
    FOREIGN KEY (received_by) REFERENCES users(user_id)
);

-- Attendance table
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'half_day') NOT NULL,
    remarks TEXT,
    recorded_by INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);
