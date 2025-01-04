import { Routes, Route } from 'react-router-dom';
import HomeScreen from '../pages/HomeScreen';
import Register from '../components/RegistrationForm/RegistrationForm';
import { AuthProvider } from '../contexts/AuthContext';
import AddMARCRecord from '../pages/MARC-Record/AddMARCRecord';
import UniversityCurriculumPage from '../pages/Curriculum-Management/UniversityCurriculumPage';
import ProgramPage from '../pages/Curriculum-Management/ProgramPage';
import VerifyOtp from '../components/Verify/VerifyOtp';
import VerifyUser from '../components/Verify/VerifyUser';
import PageNotFound from '../components/PageNotFound/PageNotFound';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';

const AppRoutes = () => (
  <Routes>
    {/* PUBLIC ROUTES */}
    <Route path="/" element={<HomeScreen />} />
    <Route path="/register" element={<Register />} />
    <Route path='/marc-record/add' element={<AddMARCRecord />} />
    <Route path='/university/curriculum' element={<UniversityCurriculumPage />} />
    <Route path="/university/curriculum/:departmentName/:programName" element={<ProgramPage />} />
    <Route path="/verify/user" element={<VerifyUser />} />
    <Route path="/verify/user/otp" element={<VerifyOtp />} />
    {/* ADMIN ROUTES */}
    <Route path="admin/*" element={<AdminRoutes />} />

    {/* PROTECTED ROUTES */}
    {/* <Route path="/library" element={<LandingPage />} /> */}


    {/* ADMIN ROUTES */}
    <Route path="admin/*" element={<AdminRoutes />} />

    {/* USER ROUTES */}
    <Route path="user/*" element={<UserRoutes />} />



    {/* Default page for unmatched routes */}
    <Route path="*" element={<PageNotFound />} />
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
