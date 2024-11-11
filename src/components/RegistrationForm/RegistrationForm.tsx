/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Container,
    Typography,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    SelectChangeEvent
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const Register: React.FC = () => {
    // Access user data passed through navigation
    const location = useLocation();
    const navigate = useNavigate();  // Replace useHistory with useNavigate
    const userData = location.state?.userData || {};

    // State to manage form fields and current step
    const [formData, setFormData] = useState({
        schoolId: userData.id || '',
        firstName: userData.firstName || '',
        middleName: userData.middleName || '',
        lastName: userData.lastName || '',
        suffix: userData.suffix || '',
        department: userData.department?.name || '', // Use department name
        course: userData.course?.name || '', // Use course name
        contactNumber: userData.contactNum || '',
        email: userData.emailAdd || '',
        libraryCardNumber: '', // Generated later
        password: '',
        role: 'STUDENT', // Default role
    });

    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1); // Step to track the current page (1 or 2)

    // Handle input change for form fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle role change
    const handleRoleChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, role: e.target.value as string });
    };

    // Handle next step button click
    const handleNext = () => {
        setStep(2);
    };

    // Generate library card number based on student ID and current date
    const generateLibraryCardNumber = () => {
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `${formData.schoolId}-${dateStamp}`;
    };

    // Handle form submission for step 2 (library card and password)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.password) {
            setError('Password is required.');
            return;
        }

        try {
            const libraryCardNumber = generateLibraryCardNumber();

            const submissionData = {
                libraryCardNumber,
                schoolId: formData.schoolId,
                role: formData.role,
                password: formData.password,
            };

            // const token = localStorage.getItem('token');

            // Call API to create a new user
            const response = await UserService.register(submissionData);

            console.log('Form Submitted:', submissionData);

            setError(null);

            // Check if response indicates success
            if (response.statusCode === 200) {
                console.log('Registration successful:', response);
                setError(null);
                setFormData({
                    schoolId: '',
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
                    role: '',
                });
                navigate('/register/card', { state: { ...formData, libraryCardNumber } });
            } else {
                console.error('Registration failed:', response);
                setError(response.message || 'Error submitting form.');
            }
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
                    {/* First page - User Details */}
                    {step === 1 && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    label="Student ID"
                                    name="schoolId"
                                    value={formData.schoolId}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Middle Name"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Suffix (Optional)"
                                    name="suffix"
                                    value={formData.suffix}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Course"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Contact Number"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
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
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleNext}
                                    sx={{ mt: 2 }}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </>
                    )}

                    {/* Second page - Library Card Number and Password */}
                    {step === 2 && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    label="Library Card Number"
                                    name="libraryCardNumber"
                                    value={generateLibraryCardNumber()}
                                    fullWidth
                                    required
                                    disabled
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

                            <Grid item xs={12}>
                                {/* Role Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleRoleChange}
                                        label="Role"
                                        required
                                    >
                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        <MenuItem value="LIBRARIAN">LIBRARIAN</MenuItem>
                                        <MenuItem value="STUDENT">STUDENT</MenuItem>
                                        <MenuItem value="FACULTY">FACULTY</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                {error && (
                                    <Typography variant="body2" color="error" gutterBottom>
                                        {error}
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Register
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </form>
        </Container>
    );
};

export default Register;
