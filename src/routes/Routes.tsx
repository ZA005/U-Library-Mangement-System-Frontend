import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from '../pages/HomeScreen';
import Register from '../components/RegistrationForm/RegistrationForm';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import UniversityCurriculumPage from '../pages/Curriculum-Management/UniversityCurriculumPage';
import ProgramPage from '../pages/Curriculum-Management/ProgramPage';
import VerifyOtp from '../components/Verify/VerifyOtp';
import VerifyUser from '../components/Verify/VerifyUser';
import PageNotFound from '../components/PageNotFound/PageNotFound';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';
import LibraryCardGenerationPage from '../pages/LibraryCardGeneration/LibraryCardGenerationPage';
import AddMARCRecord from '../pages/MARC-Record/AddMARCRecord';
import BorrowingHistory from '../pages/CirculationUser/BorrowingHistory';

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();
  const getDefaultRoute = () => {
    if (role === 'STUDENT') return <Navigate to="/user/browse" />;
    if (role === 'LIBRARIAN') return <Navigate to="/admin/library" />;
    console.log(role);
    return <HomeScreen />;
  };

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={isAuthenticated ? getDefaultRoute() : <HomeScreen />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/university/curriculum" element={<UniversityCurriculumPage />} />
      <Route
        path="/university/curriculum/:departmentName/:programName"
        element={<ProgramPage />}
      />
      <Route path="/verify/user" element={<VerifyUser open={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      } } />} />
      <Route path="/verify/user/otp" element={<VerifyOtp />} />
      <Route path='borrowing/history' element={<BorrowingHistory />} />

      {/* ADMIN ROUTES */}
      <Route
        path="admin/*"
        element={
          role === 'LIBRARIAN' ? (
            <AdminRoutes />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* USER ROUTES */}
      <Route
        path="user/*"
        element={
          role === 'STUDENT' || role === 'LIBRARIAN' ? (
            <UserRoutes />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Default page for unmatched routes */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

const RoutesWrapper = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default RoutesWrapper;
