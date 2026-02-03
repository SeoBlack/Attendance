CREATE TABLE users
(
    user_id SERIAL NOT NULL,
    role VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE courses
(
    course_id SERIAL NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (course_id)
);

CREATE TABLE lectures
(
    lecture_id SERIAL NOT NULL,
    course_id INT NOT NULL,
    description TEXT,
    lecture_date TIMESTAMP NOT NULL,
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