-- UTF-8 encoding is expected for the PostgreSQL database (default in modern installs).

CREATE TABLE users
(
    user_id SERIAL NOT NULL,
    role VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    preferred_locale VARCHAR(10),
    PRIMARY KEY (user_id)
);

CREATE TABLE courses
(
    course_id SERIAL NOT NULL,
    teacher_id INT NOT NULL,
    default_locale VARCHAR(10) NOT NULL DEFAULT 'en',
    instruction_language VARCHAR(10),

    PRIMARY KEY (course_id),
    FOREIGN KEY (teacher_id) REFERENCES users(user_id)
);

CREATE TABLE course_translation
(
    course_id INT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    description TEXT,

    PRIMARY KEY (course_id, locale),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE lectures
(
    lecture_id SERIAL NOT NULL,
    course_id INT NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    join_code VARCHAR(6),
    PRIMARY KEY (lecture_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE enrollments
(
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE attendance
(
    user_id INT NOT NULL,
    lecture_id INT NOT NULL,
    scanned_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, lecture_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id) ON DELETE CASCADE
);
