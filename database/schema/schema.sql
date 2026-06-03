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


-- 1. Users table (login only)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- student, parent, teacher, admin
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    
    -- Parent fields
    address TEXT,
    
    -- Teacher fields
    staff_id VARCHAR(50)
    
);

ALTER TABLE users DROP CONSTRAINT users_email_key;


ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;


ALTER TABLE users ALTER COLUMN email DROP NOT NULL;