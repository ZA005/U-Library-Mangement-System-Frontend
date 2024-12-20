import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from '../pages/HomeScreen';
import Register from '../components/RegistrationForm/RegistrationForm';
import { AuthProvider } from '../contexts/AuthContext';
import AddMARCRecord from '../pages/MARC-Record/AddMARCRecord';
import CurriculumManagement from '../pages/Curriculum-Management/CurriculumManagement';
import ManageCourses from '../pages/Curriculum-Management/Managers/ManageCourse';
import ManageDepartments from '../pages/Curriculum-Management/Managers/ManageDepartments';
import ManageSubjects from '../pages/Curriculum-Management/Managers/ManageSubjects';
import LandingPage from '../pages/LandingPageAdmin/LandingPage';

const AppRoutes = () => (
  <Routes>
    {/* PUBLIC ROUTES */}
    <Route path="/" element={<HomeScreen />} />
    <Route path="/register" element={<Register />} />
    <Route path='/marc-record/add' element={<AddMARCRecord />} />
    <Route path='/curriculum/management' element={<CurriculumManagement />} />
    <Route path='/curriculum/management/manage/departments' element={<ManageDepartments />} />
    <Route path='/curriculum/management/manage/courses' element={<ManageCourses />} />
    <Route path='/curriculum/management/manage/subjects' element={<ManageSubjects />} />

    {/* PROTECTED ROUTES */}
    <Route path="/library" element={<LandingPage />} />
    


    {/* Default page for unmatched routes */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const RoutesWrapper = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default RoutesWrapper;

// CURRENTLY FIXING NAVIGATION FOR BETTER DEBUGGING
// PLEASE ADD THIS ON PUBLIC ROUTES FOR TESTING
//             <Route path='/register/card' element={<LibraryCardGenerationPage />} />
//             <Route path='/' element={<HomeScreen />} /> {/* Home route to display the HomeScreen */}
//             <Route path='/curriculummanagement' element={<CurriculumManagement />} />
//             <Route path='/curriculummanagement/manage/departments' element={<ManageDepartments />} />
//             <Route path='/curriculummanagement/manage/courses' element={<ManageCourses />} />
//             <Route path='/curriculummanagement/manage/subjects' element={<ManageSubjects />} />
//             <Route path='/verify' element={<VerifyStudent />} /> {/* Registration route to display the Register component */}
//             <Route path="/verify-otp" element={<VerifyOtp />} />
//             <Route path='/register' element={<Register />} />
//             <Route path='/landing' element={<LandingPage />} /> {/* New route for admin landing page */}
//             <Route path='/marc-record/add' element={<AddMARCRecord />} />
