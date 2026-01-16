const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.post('/login', (req, res) => {
    console.log('🛠️ LOGIN ATTEMPT RECEIVED');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
  
    const { user, password } = req.body;
    if (user === 'ADMIN' && password === 'ADMIN') {
      console.log('✅ Login success');
      res.json({ success: true });
    } else {
      console.log('❌ Invalid credentials');
      res.status(401).json({ success: false });
    }
  });
  
  
  
// CRUD Endpoints for Classrooms  
// GET all Classrooms
app.get('/classrooms', (req, res) => {
  db.all('SELECT * FROM Classroom', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD a Classroom
app.post('/classrooms', (req, res) => {
  const { classroom_num, building, floor, room_type } = req.body;
  db.run('INSERT INTO Classroom (classroom_num, building, floor, room_type) VALUES (?, ?, ?, ?)', 
    [classroom_num, building, floor, room_type], 
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// UPDATE a Classroom
app.put('/classrooms/:id', (req, res) => {
  const { classroom_num, building, floor, room_type } = req.body;
  db.run('UPDATE Classroom SET classroom_num = ?, building = ?, floor = ?, room_type = ? WHERE classroom_id = ?', 
    [classroom_num, building, floor, room_type, req.params.id], 
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

// DELETE a Classroom
app.delete('/classrooms/:id', (req, res) => {
  db.run('DELETE FROM Classroom WHERE classroom_id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

// CRUD Endpoints for Courses
// GET all Courses
app.get('/courses', (req, res) => {
  db.all('SELECT * FROM Course', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD a Course
app.post('/courses', (req, res) => {
  const { course_id, course_num, prefix, days_offered, start_time, end_time, classroom_id } = req.body;
  db.run(
    'INSERT INTO Course (course_id, course_num, prefix, days_offered, start_time, end_time, classroom_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [course_id, course_num, prefix, days_offered, start_time, end_time, classroom_id],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// UPDATE a Course
app.put('/courses/:id', (req, res) => {
  const { course_num, prefix, days_offered, start_time, end_time, classroom_id } = req.body;
  db.run(
    'UPDATE Course SET course_num = ?, prefix = ?, days_offered = ?, start_time = ?, end_time = ?, classroom_id = ? WHERE course_id = ?',
    [course_num, prefix, days_offered, start_time, end_time, classroom_id, req.params.id],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

// DELETE a Course
app.delete('/courses/:id', (req, res) => {
  db.run('DELETE FROM Course WHERE course_id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});
 
// CRUD Endpoints for Student
// GET all Students
app.get('/students', (req, res) => {
  db.all('SELECT * FROM Student', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD a Student
app.post('/students', (req, res) => {
  const { student_id, first_name, last_name, email, major, grad_year } = req.body;
  db.run(
    'INSERT INTO Student (student_id, first_name, last_name, email, major, grad_year) VALUES (?, ?, ?, ?, ?, ?)',
    [student_id, first_name, last_name, email, major, grad_year],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// UPDATE a Student
app.put('/students/:id', (req, res) => {
  const { first_name, last_name, email, major, grad_year } = req.body;
  db.run(
    'UPDATE Student SET first_name = ?, last_name = ?, email = ?, major = ?, grad_year = ? WHERE student_id = ?',
    [first_name, last_name, email, major, grad_year, req.params.id],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

// DELETE a Student
app.delete('/students/:id', (req, res) => {
  db.run('DELETE FROM Student WHERE student_id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

// CRUD Endpoints for Grades
// GET all Grades
app.get('/grades', (req, res) => {
  db.all('SELECT * FROM Grades', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD Grades
app.post('/grades', (req, res) => {
  const { course_id, student_id, quiz_1, proj_1, quiz_2, proj_2, final_proj } = req.body;

  // First, get the course number from the Course table
  db.get('SELECT course_num FROM Course WHERE course_id = ?', [course_id], (err, row) => {
    if (err) return res.status(500).json(err);
    if (!row) return res.status(400).json({ error: 'Invalid course_id provided.' });

    const coursePrefix = row.course_num.split('-')[0]; // e.g., "300" from "300-01"

    // Now, check in Grades JOIN Course if the student is already in any section of that coursePrefix
    const query = `
      SELECT * 
      FROM Grades g
      JOIN Course c ON g.course_id = c.course_id
      WHERE c.course_num LIKE ? AND g.student_id = ?
    `;

    db.get(query, [`${coursePrefix}-%`, student_id], (err, existingEnrollment) => {
      if (err) {
        console.error('Error checking existing enrollment:', err);
        return res.status(500).json(err);
      }

      if (existingEnrollment) {
        return res.status(400).json({
          error: 'Student is already enrolled in another section of this course.',
        });
      }

      // Insert grade if no enrollment conflict
      db.run(
        'INSERT INTO Grades (course_id, student_id, quiz_1, proj_1, quiz_2, proj_2, final_proj) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [course_id, student_id, quiz_1, proj_1, quiz_2, proj_2, final_proj],
        function (err) {
          if (err) return res.status(500).json(err);
          res.json({ id: { course_id, student_id } });
        }
      );
    });
  });
});

// UPDATE Grades
app.put('/grades/:course_id/:student_id', (req, res) => {
  const { quiz_1, proj_1, quiz_2, proj_2, final_proj } = req.body;
  const { course_id, student_id } = req.params;
  db.run(
    'UPDATE Grades SET quiz_1 = ?, proj_1 = ?, quiz_2 = ?, proj_2 = ?, final_proj = ? WHERE course_id = ? AND student_id = ?',
    [quiz_1, proj_1, quiz_2, proj_2, final_proj, course_id, student_id],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

// DELETE Grades
app.delete('/grades/:course_id/:student_id', (req, res) => {
  const { course_id, student_id } = req.params;
  db.run('DELETE FROM Grades WHERE course_id = ? AND student_id = ?', [course_id, student_id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
