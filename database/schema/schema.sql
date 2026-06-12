-- Applications table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    application_ref VARCHAR(100) UNIQUE NOT NULL,
    
    -- Student Information
    student_name VARCHAR(100) NOT NULL,
    student_dob DATE NOT NULL,
    student_gender VARCHAR(10) NOT NULL,
    applying_for_class VARCHAR(50) NOT NULL,
    previous_school VARCHAR(200),
    
    -- Parent Information
    father_name VARCHAR(100),
    father_phone VARCHAR(20),
    mother_name VARCHAR(100),
    mother_phone VARCHAR(20),
    parent_email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    
    -- Additional Information
    how_heard VARCHAR(50),
    preferred_session VARCHAR(20),
    comments TEXT,
    
    -- Documents (Cloudinary URLs)
    birth_certificate_url TEXT,
    report_card_url TEXT,
    passport_url TEXT,
    
    -- Payment & Status
    fee_amount DECIMAL(10,2) DEFAULT 3000,
    status VARCHAR(50) DEFAULT 'pending_payment',
    
   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_ref VARCHAR(100) UNIQUE NOT NULL,
    application_ref VARCHAR(100) REFERENCES applications(application_ref) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    paystack_reference VARCHAR(100),
    paystack_response JSONB,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_applications_ref ON applications(application_ref);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_payments_ref ON payments(payment_ref);
CREATE INDEX idx_payments_application_ref ON payments(application_ref);

ALTER TABLE applications ADD COLUMN parent_phone VARCHAR(20);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE, -- 
    username VARCHAR(100) UNIQUE, -- 
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- student, parent, teacher, admin
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE teachers(
    id SERIAL PRIMARY KEY,
    teacher_id INT UNIQUE REFERENCES users(id),
    phone_number VARCHAR(20),
    address TEXT,
    teacher_name VARCHAR(255),
    date_of_birth_ DATE
);


CREATE TABLE classes(
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE class_form_teachers(
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id INT REFERENCES users(id) ON DELETE CASCADE,
    academic_session VARCHAR(20),
    UNIQUE(class_id, academic_session)
);





-- 2. Profiles table (all personal info)
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    
    -- Student fields
    admission_no VARCHAR(50),
    class VARCHAR(50),
    date_of_birth DATE,
    class_id INT REFERENCES classes(id),

    -- Parent fields
    address TEXT
    
);

CREATE TABLE academic_terms (
    id SERIAL PRIMARY KEY,
    term_name VARCHAR(20) NOT NULL, -- First Term, Second Term, Third Term
    academic_year VARCHAR(20) NOT NULL, -- 2026/2027, 2027/2028
    is_active BOOLEAN DEFAULT false 
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE class_subjects(
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id INT REFERENCES users(id) ON DELETE SET NULL,
    academic_session VARCHAR(20)
);

CREATE TABLE student_results (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    term_id INT REFERENCES academic_terms(id), 
    first_ca DECIMAL(5,2) DEFAULT 0.00, 
    second_ca DECIMAL(5,2) DEFAULT 0.00, 
    exam_score DECIMAL(5,2) DEFAULT 0.00, 
    total_score DECIMAL(5,2) GENERATED ALWAYS AS (first_ca + second_ca + exam_score) STORED,
    
    grade_letter VARCHAR(2), -- A, B, C, P, F
    teacher_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT, -- Cloudinary link if they upload a PDF/doc worksheet
    max_points INT DEFAULT 100,
    due_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INT REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    submission_text TEXT, 
    file_url TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Grading Section (Filled by the Form/Subject Teacher later)
    points_earned INT,
    teacher_feedback TEXT,
    graded_at TIMESTAMP,
    
    -- Prevents a student from submitting the same assignment twice
    CONSTRAINT unique_student_submission UNIQUE (assignment_id, student_id)
);

-- Session Table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Index to make the session expiration cleanups incredibly fast
CREATE INDEX "IDX_session_expire" ON "session" ("expire");
