import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Container,
    Typography,
    MenuItem,
    Grid
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

// Define departments and courses for the select dropdown
const departments = ['Department of Computer Science', 'Department of Engineering', 'Department of Business'];
const courses = ['BSIT', 'BSCS', 'BSBA', 'BSME'];

const Register: React.FC = () => {
    const navigate = useNavigate();
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

    const [error, setError] = useState<string | null>(null);

    // Simulate the process of confirming OTP and enrollment
    const studentIdFromOTP = '16-07984'; // This would come from the OTP verification process

    useEffect(() => {
        // Fetch user details after OTP verification and enrollment confirmation
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${UserService.BASE_URL}/details/${studentIdFromOTP}`);
                if (response.data) {
                    setFormData(prevData => ({
                        ...prevData,
                        ...response.data,
                    }));
                }
            } catch (error) {
                setError('Error fetching user details');
            }
        };

        fetchUserDetails();
    }, [studentIdFromOTP]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.email || !formData.password || !formData.studentId) {
            setError('Please fill in all required fields.');
            return;
        }

        // Generate library card number (based on studentId and current date)
        const currentDate = new Date();
        const dateStamp = currentDate.getFullYear().toString() +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') +
            currentDate.getDate().toString().padStart(2, '0');
        const libraryCardNumber = `${formData.studentId}-${dateStamp}`;

        setFormData(prevData => ({
            ...prevData,
            libraryCardNumber
        }));

        try {
            // Submit form data (including libraryCardNumber)
            console.log('Form Submitted:', formData);
            setError(null);
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
            navigate('/dashboard'); // Redirect to the dashboard after successful submission
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
                            value={formData.libraryCardNumber} // Display generated library card number
                            fullWidth
                            disabled
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
                            label="Email"
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Register
                        </Button>
                    </Grid>
                </Grid>

                {error && <Typography color="error">{error}</Typography>}
            </form>
        </Container>
    );
};

export default Register;
