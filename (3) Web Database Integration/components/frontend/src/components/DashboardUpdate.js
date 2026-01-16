import { useEffect, useState } from 'react';
import Form from './FormUpdate';

export default function Dashboard({ isAdmin }) {
    const [classrooms, setClassrooms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [searchStudent, setSearchStudent] = useState('');

    const [editClassroom, setEditClassroom] = useState(null);
    const [editCourse, setEditCourse] = useState(null);
    const [editStudent, setEditStudent] = useState(null);
    const [editGrade, setEditGrade] = useState(null);

    const fetchData = () => {
        fetch('http://localhost:5000/classrooms')
            .then(res => res.json())
            .then(setClassrooms);

        fetch('http://localhost:5000/courses')
            .then(res => res.json())
            .then(setCourses);

        fetch('http://localhost:5000/students')
            .then(res => res.json())
            .then(setStudents);

        fetch('http://localhost:5000/grades')
            .then(res => res.json())
            .then(setGrades);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addOrUpdateClassroom = async (data) => {
        const method = editClassroom ? 'PUT' : 'POST';
        const url = editClassroom
            ? `http://localhost:5000/classrooms/${editClassroom.classroom_id}`
            : 'http://localhost:5000/classrooms';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        setEditClassroom(null);
        fetchData();
    };

    const addOrUpdateCourse = async (data) => {
        const method = editCourse ? 'PUT' : 'POST';
        const url = editCourse
            ? `http://localhost:5000/courses/${editCourse.course_id}`
            : 'http://localhost:5000/courses';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        setEditCourse(null);
        fetchData();
    };

    const addOrUpdateStudent = async (data) => {
        const method = editStudent ? 'PUT' : 'POST';
        const url = editStudent
            ? `http://localhost:5000/students/${editStudent.student_id}`
            : 'http://localhost:5000/students';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        setEditStudent(null);
        fetchData();
    };

    const addOrUpdateGrade = async (data) => {
        const method = editGrade ? 'PUT' : 'POST';
        const url = editGrade
            ? `http://localhost:5000/grades/${editGrade.course_id}/${editGrade.student_id}`
            : 'http://localhost:5000/grades';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        setEditGrade(null);
        fetchData();
    };

    const deleteClassroom = async (id) => {
        await fetch(`http://localhost:5000/classrooms/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const deleteCourse = async (id) => {
        await fetch(`http://localhost:5000/courses/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const deleteStudent = async (id) => {
        await fetch(`http://localhost:5000/students/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const deleteGrade = async (courseId, studentId) => {
        await fetch(`http://localhost:5000/grades/${courseId}/${studentId}`, { method: 'DELETE' });
        fetchData();
    };

    const filteredStudents = students.filter(s =>
        (s.first_name + ' ' + s.last_name).toLowerCase().includes(searchStudent.toLowerCase())
    );

    return (
        <div>
            <h2>Classrooms</h2>
            {isAdmin && (
                <Form
                    type="classroom"
                    onSubmit={addOrUpdateClassroom}
                    initialData={editClassroom || {}}
                />
            )}
            <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                <thead>
                    <tr>
                        <th>Classroom ID</th>
                        <th>Room Number</th>
                        <th>Building</th>
                        <th>Floor</th>
                        <th>Room Type</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {classrooms.map(cls => (
                        <tr key={cls.classroom_id}>
                            <td>{cls.classroom_id}</td>
                            <td>{cls.classroom_num}</td>
                            <td>{cls.building}</td>
                            <td>{cls.floor}</td>
                            <td>{cls.room_type}</td>
                            {isAdmin && (
                                <td>
                                    <button onClick={() => setEditClassroom(cls)}>Edit</button>
                                    <button onClick={() => deleteClassroom(cls.classroom_id)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Courses</h2>
            {isAdmin && (
                <Form
                    type="course"
                    onSubmit={addOrUpdateCourse}
                    initialData={editCourse || {}}
                    classrooms={classrooms}
                />
            )}
            <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Number</th>
                        <th>Prefix</th>
                        <th>Days Offered</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Classroom</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td>{course.course_num}</td>
                            <td>{course.prefix}</td>
                            <td>{course.days_offered}</td>
                            <td>{course.start_time}</td>
                            <td>{course.end_time}</td>
                            <td>{course.classroom_id}</td>
                            {isAdmin && (
                                <td>
                                    <button onClick={() => setEditCourse(course)}>Edit</button>
                                    <button onClick={() => deleteCourse(course.course_id)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Students</h2>
            <input
                placeholder="Search student name..."
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
            />
            {isAdmin && (
                <Form
                    type="student"
                    onSubmit={addOrUpdateStudent}
                    initialData={editStudent || {}}
                />
            )}
            <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Major</th>
                        <th>Graduation Year</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(student => (
                        <tr key={student.student_id}>
                            <td>{student.student_id}</td>
                            <td>{student.first_name}</td>
                            <td>{student.last_name}</td>
                            <td>{student.email}</td>
                            <td>{student.major}</td>
                            <td>{student.grad_year}</td>
                            {isAdmin && (
                                <td>
                                    <button onClick={() => setEditStudent(student)}>Edit</button>
                                    <button onClick={() => deleteStudent(student.student_id)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Grades</h2>
            {isAdmin && (
                <Form
                    type="grade"
                    onSubmit={addOrUpdateGrade}
                    initialData={editGrade || {}}
                    students={students}
                    courses={courses}
                />
            )}
            <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Student ID</th>
                        <th>Quiz 1</th>
                        <th>Project 1</th>
                        <th>Quiz 2</th>
                        <th>Project 2</th>
                        <th>Final Project</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {grades.map(grade => (
                        <tr key={`${grade.course_id}-${grade.student_id}`}>
                            <td>{grade.course_id}</td>
                            <td>{grade.student_id}</td>
                            <td>{grade.quiz_1}</td>
                            <td>{grade.proj_1}</td> {/* Make sure this is properly closed */}
                            <td>{grade.quiz_2}</td>
                            <td>{grade.proj_2}</td>
                            <td>{grade.final_proj}</td>
                            {isAdmin && (
                                <td>
                                    <button onClick={() => setEditGrade(grade)}>Edit</button>
                                    <button onClick={() => deleteGrade(grade.course_id, grade.student_id)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}