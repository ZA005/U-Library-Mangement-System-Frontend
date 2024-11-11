import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Container,
    Typography,
    MenuItem,
    Grid
} from '@mui/material';

// Define departments and courses for the select dropdown
const departments = ['Department of Computer Science', 'Department of Engineering', 'Department of Business'];
const courses = ['BSIT', 'BSCS', 'BSBA', 'BSME'];

const Register: React.FC = () => {
    // State for form data
    const [formData, setFormData] = useState({
        studentId: '',
        libraryCardNumber: '',
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        department: '',
        course: '',
        contactNumber: '',
        email: '',
        password: '',
    });

    // State for error handling (can be used for validation)
    const [error, setError] = useState<string | null>(null);

    // Handle input change for the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation logic goes here (e.g., required fields, email format, password strength, etc.)
        if (!formData.email || !formData.password || !formData.studentId) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            // Call API or handle form submission logic here
            console.log('Form Submitted:', formData);

            // Reset error
            setError(null);

            // Clear form after submission
            setFormData({
                studentId: '',
                libraryCardNumber: '',
                firstName: '',
                middleName: '',
                lastName: '',
                suffix: '',
                department: '',
                course: '',
                contactNumber: '',
                email: '',
                password: '',
            });
        } catch (error) {
            setError('Error submitting form.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Register
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Student ID"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Library Card Number"
                            name="libraryCardNumber"
                            value={formData.libraryCardNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Middle Name"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Suffix (Optional)"
                            name="suffix"
                            value={formData.suffix}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {departments.map((dept, index) => (
                                <MenuItem key={index} value={dept}>
                                    {dept}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Course"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {courses.map((course, index) => (
                                <MenuItem key={index} value={course}>
                                    {course}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Contact Number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>

                {/* Show error if any */}
                {error && (
                    <Typography variant="body2" color="error" gutterBottom>
                        {error}
                    </Typography>
                )}

                {/* Submit Button */}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default Register;
