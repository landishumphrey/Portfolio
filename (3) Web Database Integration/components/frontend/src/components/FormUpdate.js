import { useState } from 'react';

export default function Form({ type, onSubmit, initialData = {}, classrooms = [], students = [], courses = [] }) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {type === 'classroom' ? (
                <>
                    <input
                        name="classroom_num"
                        placeholder="Classroom Number"
                        value={formData.classroom_num || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="building"
                        placeholder="Building"
                        value={formData.building || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="floor"
                        type="number"
                        placeholder="Floor"
                        value={formData.floor || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="room_type"
                        placeholder="Room Type"
                        value={formData.room_type || ''}
                        onChange={handleChange}
                        required
                    />
                </>
            ) : type === 'course' ? (
                <>
                    <input
                        name="course_num"
                        placeholder="Course Number"
                        value={formData.course_num || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="prefix"
                        placeholder="Course Prefix"
                        value={formData.prefix || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="days_offered"
                        placeholder="Days Offered"
                        value={formData.days_offered || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="start_time"
                        type="time"
                        value={formData.start_time || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="end_time"
                        type="time"
                        value={formData.end_time || ''}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="classroom_id"
                        value={formData.classroom_id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Classroom</option>
                        {classrooms.map(cls => (
                            <option key={cls.classroom_id} value={cls.classroom_id}>
                                {cls.building} - Room {cls.classroom_num}
                            </option>
                        ))}
                    </select>
                </>
            ) : type === 'student' ? (
                <>
                    <input
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email || ''}
                        onChange={handleChange}
                    />
                    <input
                        name="major"
                        placeholder="Major"
                        value={formData.major || ''}
                        onChange={handleChange}
                    />
                    <input
                        name="grad_year"
                        type="number"
                        placeholder="Graduation Year"
                        value={formData.grad_year || ''}
                        onChange={handleChange}
                    />
                </>
            ) : type === 'grade' ? (
                <>
                    <select
                        name="course_id"
                        value={formData.course_id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.course_id} value={course.course_id}>
                                {course.prefix} {course.course_num}
                            </option>
                        ))}
                    </select>
                    <select
                        name="student_id"
                        value={formData.student_id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Student</option>
                        {students.map(student => (
                            <option key={student.student_id} value={student.student_id}>
                                {student.first_name} {student.last_name}
                            </option>
                        ))}
                    </select>
                    <input
                        name="quiz_1"
                        type="number"
                        step="0.01"
                        placeholder="Quiz 1"
                        value={formData.quiz_1 || ''}
                        onChange={handleChange}
                    />
                    <input
                        name="proj_1"
                        type="number"
                        step="0.01"
                        placeholder="Project 1"
                        value={formData.proj_1 || ''}
                        onChange={handleChange}
                    />
                    <input
                        name="quiz_2"
                        type="number"
                        step="0.01"
                        placeholder="Quiz 2"
                        value={formData.quiz_2 || ''}
                        onChange={handleChange}
                    />
                    <input
                        name="proj_2"
                        type="number"
                        step="0.01"
                        placeholder="Project 2"
                        value={formData.proj_2 || ''}
                        onChange={handleChange}
                    />
                    <input
                        name="final_proj"
                        type="number"
                        step="0.01"
                        placeholder="Final Project"
                        value={formData.final_proj || ''}
                        onChange={handleChange}
                    />
                </>
            ) : null}

            <button type="submit">
                {initialData?.classroom_id || initialData?.course_id || initialData?.student_id || initialData?.grade_id ? 'Update' : 'Add'}
            </button>
        </form>
    );
}