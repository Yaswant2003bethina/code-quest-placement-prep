
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import sqlite3
import os
import json
import subprocess
import tempfile
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database initialization
def init_db():
    conn = sqlite3.connect('placement_platform.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            roll_number TEXT,
            department TEXT,
            year INTEGER,
            phone_number TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Problems table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            category TEXT,
            tags TEXT,
            input_format TEXT,
            output_format TEXT,
            sample_input TEXT,
            sample_output TEXT,
            time_limit INTEGER DEFAULT 2,
            memory_limit INTEGER DEFAULT 256,
            created_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # Test cases table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS test_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            problem_id INTEGER,
            input_data TEXT,
            expected_output TEXT,
            is_hidden BOOLEAN DEFAULT 0,
            points INTEGER DEFAULT 10,
            FOREIGN KEY (problem_id) REFERENCES problems (id)
        )
    ''')
    
    # Submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            problem_id INTEGER,
            code TEXT NOT NULL,
            language TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            score INTEGER DEFAULT 0,
            execution_time REAL,
            memory_used INTEGER,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (problem_id) REFERENCES problems (id)
        )
    ''')
    
    # Documents table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            file_path TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_size INTEGER,
            uploaded_by INTEGER,
            tags TEXT,
            is_public BOOLEAN DEFAULT 1,
            download_count INTEGER DEFAULT 0,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (uploaded_by) REFERENCES users (id)
        )
    ''')
    
    # Create default admin user
    admin_email = 'admin@placement.com'
    cursor.execute('SELECT id FROM users WHERE email = ?', (admin_email,))
    if not cursor.fetchone():
        admin_password = generate_password_hash('admin123')
        cursor.execute('''
            INSERT INTO users (email, password_hash, role, first_name, last_name)
            VALUES (?, ?, ?, ?, ?)
        ''', (admin_email, admin_password, 'admin', 'Admin', 'User'))
    
    # Insert sample problems
    sample_problems = [
        {
            'title': 'Two Sum',
            'description': 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            'difficulty': 'Easy',
            'category': 'Array',
            'tags': 'array,hash-table',
            'input_format': 'First line contains n (array size) and target. Second line contains n integers.',
            'output_format': 'Two space-separated integers representing the indices.',
            'sample_input': '4 9\n2 7 11 15',
            'sample_output': '0 1'
        },
        {
            'title': 'Reverse String',
            'description': 'Write a function that reverses a string. The input string is given as an array of characters s.',
            'difficulty': 'Easy',
            'category': 'String',
            'tags': 'string,two-pointers',
            'input_format': 'A single line containing the string to reverse.',
            'output_format': 'The reversed string.',
            'sample_input': 'hello',
            'sample_output': 'olleh'
        },
        {
            'title': 'Binary Search',
            'description': 'Given a sorted array and a target value, return the index if the target is found. If not, return -1.',
            'difficulty': 'Medium',
            'category': 'Search',
            'tags': 'array,binary-search',
            'input_format': 'First line contains n (array size) and target. Second line contains n sorted integers.',
            'output_format': 'Index of target or -1 if not found.',
            'sample_input': '6 5\n1 2 3 4 5 6',
            'sample_output': '4'
        }
    ]
    
    for problem in sample_problems:
        cursor.execute('SELECT id FROM problems WHERE title = ?', (problem['title'],))
        if not cursor.fetchone():
            cursor.execute('''
                INSERT INTO problems (title, description, difficulty, category, tags, 
                                    input_format, output_format, sample_input, sample_output, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (problem['title'], problem['description'], problem['difficulty'], 
                 problem['category'], problem['tags'], problem['input_format'], 
                 problem['output_format'], problem['sample_input'], problem['sample_output'], 1))
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Helper functions
def get_db_connection():
    conn = sqlite3.connect('placement_platform.db')
    conn.row_factory = sqlite3.Row
    return conn

def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def admin_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            flash('Admin access required', 'error')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# Routes
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ? AND is_active = 1', (email,)).fetchone()
        conn.close()
        
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['role'] = user['role']
            session['name'] = f"{user['first_name']} {user['last_name']}"
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'error')
    
    return render_template('auth/login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name']
        if not all(field in data for field in required_fields):
            flash('All fields are required', 'error')
            return render_template('auth/register.html')
        
        conn = get_db_connection()
        
        # Check if user already exists
        existing_user = conn.execute('SELECT id FROM users WHERE email = ?', (data['email'],)).fetchone()
        if existing_user:
            flash('Email already registered', 'error')
            conn.close()
            return render_template('auth/register.html')
        
        # Create new user
        password_hash = generate_password_hash(data['password'])
        conn.execute('''
            INSERT INTO users (email, password_hash, first_name, last_name, 
                             roll_number, department, year, phone_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data['email'], password_hash, data['first_name'], data['last_name'],
              data.get('roll_number'), data.get('department'), 
              data.get('year'), data.get('phone_number')))
        
        conn.commit()
        conn.close()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('auth/register.html')

@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db_connection()
    
    if session['role'] == 'admin':
        # Admin dashboard stats
        stats = {
            'total_users': conn.execute('SELECT COUNT(*) as count FROM users WHERE role = "student"').fetchone()['count'],
            'total_problems': conn.execute('SELECT COUNT(*) as count FROM problems WHERE is_active = 1').fetchone()['count'],
            'total_submissions': conn.execute('SELECT COUNT(*) as count FROM submissions').fetchone()['count'],
            'recent_submissions': conn.execute('''
                SELECT s.*, u.first_name, u.last_name, p.title 
                FROM submissions s
                JOIN users u ON s.user_id = u.id
                JOIN problems p ON s.problem_id = p.id
                ORDER BY s.submitted_at DESC LIMIT 10
            ''').fetchall()
        }
        conn.close()
        return render_template('admin/dashboard.html', stats=stats)
    else:
        # Student dashboard
        user_id = session['user_id']
        stats = {
            'solved_problems': conn.execute('SELECT COUNT(DISTINCT problem_id) as count FROM submissions WHERE user_id = ? AND status = "Accepted"', (user_id,)).fetchone()['count'],
            'total_submissions': conn.execute('SELECT COUNT(*) as count FROM submissions WHERE user_id = ?', (user_id,)).fetchone()['count'],
            'recent_submissions': conn.execute('''
                SELECT s.*, p.title 
                FROM submissions s
                JOIN problems p ON s.problem_id = p.id
                WHERE s.user_id = ?
                ORDER BY s.submitted_at DESC LIMIT 10
            ''', (user_id,)).fetchall()
        }
        conn.close()
        return render_template('student/dashboard.html', stats=stats)

@app.route('/problems')
@login_required
def problems():
    conn = get_db_connection()
    
    # Get filter parameters
    difficulty = request.args.get('difficulty', '')
    category = request.args.get('category', '')
    
    # Build query
    query = 'SELECT * FROM problems WHERE is_active = 1'
    params = []
    
    if difficulty:
        query += ' AND difficulty = ?'
        params.append(difficulty)
    
    if category:
        query += ' AND category = ?'
        params.append(category)
    
    query += ' ORDER BY created_at DESC'
    
    problems = conn.execute(query, params).fetchall()
    
    # Get categories for filter
    categories = conn.execute('SELECT DISTINCT category FROM problems WHERE is_active = 1 AND category IS NOT NULL').fetchall()
    
    conn.close()
    return render_template('student/problems.html', problems=problems, categories=categories)

@app.route('/problem/<int:problem_id>')
@login_required
def problem_detail(problem_id):
    conn = get_db_connection()
    
    problem = conn.execute('SELECT * FROM problems WHERE id = ? AND is_active = 1', (problem_id,)).fetchone()
    if not problem:
        flash('Problem not found', 'error')
        return redirect(url_for('problems'))
    
    # Get test cases (only non-hidden ones for students)
    if session['role'] == 'admin':
        test_cases = conn.execute('SELECT * FROM test_cases WHERE problem_id = ?', (problem_id,)).fetchall()
    else:
        test_cases = conn.execute('SELECT * FROM test_cases WHERE problem_id = ? AND is_hidden = 0', (problem_id,)).fetchall()
    
    # Get user's submissions for this problem
    user_submissions = []
    if session['role'] == 'student':
        user_submissions = conn.execute('''
            SELECT * FROM submissions 
            WHERE user_id = ? AND problem_id = ? 
            ORDER BY submitted_at DESC
        ''', (session['user_id'], problem_id)).fetchall()
    
    conn.close()
    return render_template('student/problem_detail.html', problem=problem, test_cases=test_cases, submissions=user_submissions)

@app.route('/admin/problems')
@admin_required
def admin_problems():
    conn = get_db_connection()
    problems = conn.execute('''
        SELECT p.*, u.first_name, u.last_name 
        FROM problems p
        LEFT JOIN users u ON p.created_by = u.id
        ORDER BY p.created_at DESC
    ''').fetchall()
    conn.close()
    return render_template('admin/problems.html', problems=problems)

@app.route('/admin/problem/create', methods=['GET', 'POST'])
@admin_required
def create_problem():
    if request.method == 'POST':
        data = request.form
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert problem
        cursor.execute('''
            INSERT INTO problems (title, description, difficulty, category, tags,
                                input_format, output_format, sample_input, sample_output,
                                time_limit, memory_limit, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data['title'], data['description'], data['difficulty'], data['category'],
              data['tags'], data['input_format'], data['output_format'],
              data['sample_input'], data['sample_output'], data['time_limit'],
              data['memory_limit'], session['user_id']))
        
        problem_id = cursor.lastrowid
        
        # Insert test cases
        test_cases_data = json.loads(data.get('test_cases', '[]'))
        for test_case in test_cases_data:
            cursor.execute('''
                INSERT INTO test_cases (problem_id, input_data, expected_output, is_hidden, points)
                VALUES (?, ?, ?, ?, ?)
            ''', (problem_id, test_case['input'], test_case['output'], 
                  test_case.get('hidden', False), test_case.get('points', 10)))
        
        conn.commit()
        conn.close()
        
        flash('Problem created successfully!', 'success')
        return redirect(url_for('admin_problems'))
    
    return render_template('admin/create_problem.html')

@app.route('/api/execute', methods=['POST'])
@login_required
def execute_code():
    data = request.json
    code = data.get('code', '')
    language = data.get('language', 'python')
    input_data = data.get('input', '')
    
    if not code:
        return jsonify({'error': 'No code provided'}), 400
    
    try:
        result = run_code(code, language, input_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit', methods=['POST'])
@login_required
def submit_solution():
    data = request.json
    problem_id = data.get('problem_id')
    code = data.get('code', '')
    language = data.get('language', 'python')
    
    if not all([problem_id, code]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    
    # Get problem and test cases
    problem = conn.execute('SELECT * FROM problems WHERE id = ?', (problem_id,)).fetchone()
    test_cases = conn.execute('SELECT * FROM test_cases WHERE problem_id = ?', (problem_id,)).fetchall()
    
    if not problem:
        return jsonify({'error': 'Problem not found'}), 404
    
    # Execute code against test cases
    total_score = 0
    total_points = sum(tc['points'] for tc in test_cases)
    status = 'Wrong Answer'
    
    for test_case in test_cases:
        try:
            result = run_code(code, language, test_case['input_data'])
            if result.get('output', '').strip() == test_case['expected_output'].strip():
                total_score += test_case['points']
        except:
            break
    
    if total_score == total_points:
        status = 'Accepted'
    elif total_score > 0:
        status = 'Partial'
    
    # Save submission
    conn.execute('''
        INSERT INTO submissions (user_id, problem_id, code, language, status, score, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (session['user_id'], problem_id, code, language, status, total_score, datetime.now()))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'status': status,
        'score': total_score,
        'total_points': total_points
    })

def run_code(code, language, input_data=''):
    """Execute code in a secure environment"""
    try:
        if language == 'python':
            return run_python_code(code, input_data)
        elif language == 'javascript':
            return run_javascript_code(code, input_data)
        else:
            return {'error': 'Unsupported language'}
    except Exception as e:
        return {'error': str(e)}

def run_python_code(code, input_data=''):
    """Execute Python code securely"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        f.flush()
        
        try:
            process = subprocess.Popen(
                ['python', f.name],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=5
            )
            
            stdout, stderr = process.communicate(input=input_data)
            
            if stderr:
                return {'error': stderr}
            
            return {'output': stdout}
            
        except subprocess.TimeoutExpired:
            return {'error': 'Time Limit Exceeded'}
        finally:
            os.unlink(f.name)

def run_javascript_code(code, input_data=''):
    """Execute JavaScript code securely"""
    # Create a simple Node.js script
    js_code = f"""
const readline = require('readline');
const rl = readline.createInterface({{
    input: process.stdin,
    output: process.stdout
}});

// Mock input data
const inputLines = `{input_data}`.split('\\n');
let lineIndex = 0;

// Override console.log to capture output
let output = '';
const originalLog = console.log;
console.log = (...args) => {{
    output += args.join(' ') + '\\n';
}};

// Mock input function
function input() {{
    return inputLines[lineIndex++] || '';
}}

// User code
{code}

// Output result
process.stdout.write(output);
"""
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(js_code)
        f.flush()
        
        try:
            process = subprocess.Popen(
                ['node', f.name],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=5
            )
            
            stdout, stderr = process.communicate()
            
            if stderr:
                return {'error': stderr}
            
            return {'output': stdout}
            
        except subprocess.TimeoutExpired:
            return {'error': 'Time Limit Exceeded'}
        finally:
            os.unlink(f.name)

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
