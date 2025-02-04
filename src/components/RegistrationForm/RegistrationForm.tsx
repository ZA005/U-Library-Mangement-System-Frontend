import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Box,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserManagement/UserService';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Style from './RegistrationForm.module.css';

const RegisterForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData || {};
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolId: userData.id || '',
    firstName: userData.firstName || '',
    middleName: userData.middleName || '',
    lastName: userData.lastName || '',
    suffix: userData.suffix || '',
    department: userData.department?.name || '',
    program: userData.program?.description || '',
    contactNumber: userData.contactNum || '',
    email: userData.emailAdd || '',
    libraryCardNumber: '',
    password: '',
    role: 'STUDENT',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, role: e.target.value as string });
  };

  const handleNext = () => {
    setStep(2);
  };
  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const generateLibraryCardNumber = () => {
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `${formData.schoolId}-${dateStamp}`;
  };

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

      const response = await UserService.register(submissionData);

      console.log('Form Submitted:', submissionData);

      setError(null);

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
          program: '',
          contactNumber: '',
          email: '',
          password: '',
          role: '',
        });
        navigate('/library-card', { state: { ...formData, libraryCardNumber } });
      } else {
        console.error('Registration failed:', response);
        setError(response.message || 'Error submitting form.');
      }
    } catch (error) {
      setError('Error submitting form.' + error);
    }
  };

  return (
    <>
      <Box className={Style.rootContainer}>
        <Container>
          <Header buttons={[]} />
        </Container>


        <Container className={`${Style.container} ${Style.registerFormContainer}`}>
          <Typography variant="h4" align="center" gutterBottom>
            Account Activation
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {step === 1 && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Student ID"
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleChange}
                      fullWidth
                      required
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Contact Number"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      fullWidth
                      required
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Middle Name"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      fullWidth
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      fullWidth
                      required
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid>
                  {formData.suffix && (
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Suffix"
                        name="suffix"
                        value={formData.suffix}
                        onChange={handleChange}
                        fullWidth
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={4.5}>
                    <TextField
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      fullWidth
                      required
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <TextField
                      label="Course"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      fullWidth
                      required
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
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
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleNext}
                      className={Style.buttonCommon}
                    >
                      Next
                    </Button>
                  </Grid>
                </>
              )}

              {step === 2 && (
                <>
                  {/* <Grid item xs={12}>
                    <TextField
                      label="Library Card Number"
                      name="libraryCardNumber"
                      value={generateLibraryCardNumber()}
                      fullWidth
                      required
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Grid> */}

                  <Grid item xs={12}>
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
                    {error && (
                      <Typography variant="body2" color="error" gutterBottom>
                        {error}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                    <Grid item xs={5.9}>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        fullWidth
                        className={Style.buttonCommon}
                        sx={{ borderColor: '#CC0000', color: '#CC0000', '&:hover': { borderColor: '#a00000', color: '#a00000' } }}
                      >
                        Back
                      </Button>
                    </Grid>
                    <Grid item xs={5.9}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className={Style.buttonCommon}
                      >
                        Activate
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </Container>
        <Box component="footer" className={Style.footer}>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default RegisterForm;