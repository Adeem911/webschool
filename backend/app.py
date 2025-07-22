from flask import Flask, request, jsonify
from flask_cors import CORS
from database import Database
from models import *
import json
from datetime import date, time
from typing import Optional

app = Flask(__name__)
CORS(app)
db = Database()
db.connect()

from decimal import Decimal

def convert_decimal(obj):
    if isinstance(obj, list):
        return [convert_decimal(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj


# Helper function to convert date strings to date objects
def parse_date(date_str: Optional[str]) -> Optional[date]:
    if not date_str:
        return None
    return date.fromisoformat(date_str)

def parse_time(time_str: Optional[str]) -> Optional[time]:
    if not time_str:
        return None
    return time.fromisoformat(time_str)




# API Routes for Families
@app.route('/api/families', methods=['GET', 'POST'])
def families():
    if request.method == 'GET':
        query = "SELECT * FROM families"
        families = db.execute_query(query)
        return jsonify(families)
    
    elif request.method == 'POST':
        data = request.json
        family = Family(**data)
        query = """
        INSERT INTO families (family_name, address, contact_number, email)
        VALUES (%s, %s, %s, %s)
        """
        family_id = db.execute_query(query, (
            family.family_name, family.address, 
            family.contact_number, family.email
        ))
        return jsonify({"family_id": family_id}), 201

@app.route('/api/families/<int:family_id>', methods=['GET', 'PUT', 'DELETE'])
def family(family_id):
    if request.method == 'GET':
        query = "SELECT * FROM families WHERE family_id = %s"
        family = db.execute_query(query, (family_id,), fetch_one=True)
        if family:
            return jsonify(family)
        return jsonify({"error": "Family not found"}), 404
    
    elif request.method == 'PUT':
        data = request.json
        family = Family(**data)
        query = """
        UPDATE families 
        SET family_name = %s, address = %s, contact_number = %s, email = %s
        WHERE family_id = %s
        """
        rows_affected = db.execute_query(query, (
            family.family_name, family.address, 
            family.contact_number, family.email, family_id
        ))
        if rows_affected:
            return jsonify({"message": "Family updated successfully"})
        return jsonify({"error": "Family not found"}), 404
    
    elif request.method == 'DELETE':
        query = "DELETE FROM families WHERE family_id = %s"
        rows_affected = db.execute_query(query, (family_id,))
        if rows_affected:
            return jsonify({"message": "Family deleted successfully"})
        return jsonify({"error": "Family not found"}), 404

# API Routes for Students
@app.route('/api/students', methods=['GET', 'POST'])
def students():
    if request.method == 'GET':
        query = "SELECT * FROM students"
        students = db.execute_query(query)
        return jsonify(students)
    
    elif request.method == 'POST':
        data = request.json
        data['date_of_birth'] = parse_date(data['date_of_birth'])
        data['admission_date'] = parse_date(data['admission_date'])
        student = Student(**data)
        query = """
        INSERT INTO students 
        (family_id, first_name, last_name, date_of_birth, gender, 
         admission_date, current_class, section, status, profile_picture)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        student_id = db.execute_query(query, (
            student.family_id, student.first_name, student.last_name, 
            student.date_of_birth, student.gender, student.admission_date,
            student.current_class, student.section, student.status, 
            student.profile_picture
        ))
        return jsonify({"student_id": student_id}), 201

@app.route('/api/students/<int:student_id>', methods=['GET', 'PUT', 'DELETE'])
def student(student_id):
    if request.method == 'GET':
        query = "SELECT * FROM students WHERE student_id = %s"
        student = db.execute_query(query, (student_id,), fetch_one=True)
        if student:
            return jsonify(student)
        return jsonify({"error": "Student not found"}), 404
    
    elif request.method == 'PUT':
        data = request.json
        data['date_of_birth'] = parse_date(data['date_of_birth'])
        data['admission_date'] = parse_date(data['admission_date'])
        student = Student(**data)
        query = """
        UPDATE students 
        SET family_id = %s, first_name = %s, last_name = %s, date_of_birth = %s, 
            gender = %s, admission_date = %s, current_class = %s, 
            section = %s, status = %s, profile_picture = %s
        WHERE student_id = %s
        """
        rows_affected = db.execute_query(query, (
            student.family_id, student.first_name, student.last_name, 
            student.date_of_birth, student.gender, student.admission_date,
            student.current_class, student.section, student.status, 
            student.profile_picture, student_id
        ))
        if rows_affected:
            return jsonify({"message": "Student updated successfully"})
        return jsonify({"error": "Student not found"}), 404
    
    elif request.method == 'DELETE':
        query = "DELETE FROM students WHERE student_id = %s"
        rows_affected = db.execute_query(query, (student_id,))
        if rows_affected:
            return jsonify({"message": "Student deleted successfully"})
        return jsonify({"error": "Student not found"}), 404

# API Routes for Fee Payments
@app.route('/api/families/<int:family_id>/payments', methods=['GET', 'POST'])
def family_payments(family_id):
    if request.method == 'GET':
        query = """
        SELECT fp.*, fs.fee_name, fs.amount as fee_amount, fs.frequency, 
               CONCAT(u.full_name) as received_by_name
        FROM fee_payments fp
        JOIN fee_structure fs ON fp.fee_id = fs.fee_id
        JOIN users u ON fp.received_by = u.user_id
        WHERE fp.family_id = %s
        """
        payments = db.execute_query(query, (family_id,))
        return jsonify(payments)
    
    elif request.method == 'POST':
        data = request.json
        data['payment_date'] = parse_date(data['payment_date'])
        payment = FeePayment(**data)
        query = """
        INSERT INTO fee_payments 
        (family_id, fee_id, amount_paid, payment_date, payment_method, 
         transaction_reference, received_by, remarks)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        payment_id = db.execute_query(query, (
            family_id, payment.fee_id, payment.amount_paid, 
            payment.payment_date, payment.payment_method,
            payment.transaction_reference, payment.received_by, 
            payment.remarks
        ))
        return jsonify({"payment_id": payment_id}), 201

# API Routes for Exam Results
@app.route('/api/students/<int:student_id>/results', methods=['GET'])
def student_results(student_id):
    query = """
    SELECT er.*, e.exam_name, e.exam_date, s.subject_name, 
           e.total_marks, e.passing_marks
    FROM exam_results er
    JOIN exams e ON er.exam_id = e.exam_id
    JOIN subjects s ON e.subject_id = s.subject_id
    WHERE er.student_id = %s
    """
    results = db.execute_query(query, (student_id,))
    return jsonify(results)

# API Routes for Timetable
@app.route('/api/timetable/class/<string:class_name>', methods=['GET'])
def class_timetable(class_name):
    query = """
    SELECT tt.*, s.subject_name, t.first_name as teacher_first_name, 
           t.last_name as teacher_last_name
    FROM timetable tt
    JOIN subjects s ON tt.subject_id = s.subject_id
    JOIN teachers t ON tt.teacher_id = t.teacher_id
    JOIN classes c ON tt.class_id = c.class_id
    WHERE c.class_name = %s
    ORDER BY tt.day_of_week, tt.start_time
    """
    timetable = db.execute_query(query, (class_name,))
    return jsonify(timetable)

# API Routes for Attendance
@app.route('/api/students/<int:student_id>/attendance', methods=['GET'])
def student_attendance(student_id):
    query = """
    SELECT a.*, CONCAT(u.full_name) as recorded_by_name
    FROM attendance a
    JOIN users u ON a.recorded_by = u.user_id
    WHERE a.student_id = %s
    ORDER BY a.date DESC
    """
    attendance = db.execute_query(query, (student_id,))
    return jsonify(attendance)

@app.route('/api/exams', methods=['GET'])
def get_exams():
    query = "SELECT * FROM exams"
    exams = db.execute_query(query)
    return jsonify(convert_decimal(exams))



if __name__ == '__main__':
    app.run(debug=True, port=5000)