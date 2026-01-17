const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'dbms.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables if not exists
db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Classroom(
    classroom_id INTEGER PRIMARY KEY AUTOINCREMENT,
    classroom_num INT,
    building VARCHAR(50) NOT NULL,
    floor INT,
    room_type VARCHAR(25)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Course(
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_num VARCHAR(6) NOT NULL,
    prefix VARCHAR(5) NOT NULL,
    days_offered VARCHAR(5),
    start_time TIME,
    end_time TIME,
    classroom_id INTEGER,
    CONSTRAINT fk_course_roomid
      FOREIGN KEY (classroom_id) 
        REFERENCES Classroom(classroom_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Student(
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    major VARCHAR(50),
    grad_year INT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS Grades(
    course_id INT,
    student_id INT,
    quiz_1 FLOAT,
    proj_1 FLOAT,
    quiz_2 FLOAT,
    proj_2 FLOAT,
    final_proj FLOAT,
    PRIMARY KEY (course_id, student_id),
    CONSTRAINT fk_grades_course
      FOREIGN KEY (course_id) 
        REFERENCES Course(course_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
    CONSTRAINT fk_grades_student
      FOREIGN KEY (student_id) 
          REFERENCES Student(student_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
  )`);
});

module.exports = db;
