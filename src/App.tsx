import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen'; // Import the HomeScreen component
import { AuthProvider } from './contexts/AuthContext';
import LibraryCardGenerationPage from './pages/LibraryCardGeneration/LibraryCardGenerationPage';
import Register from './components/RegistrationForm/RegistrationForm';
import VerifyOtp from './components/Verify/VerifyOtp';
import VerifyStudent from './components/Verify/VerifyUser';
import UserService from './services/UserService';
import CurriculumManagement from './pages/Curriculum-Management/CurriculumManagement';
import ManageDepartments from './pages/CurriculumManagementButtonScreens/ManageDepartments';
import ManageCourses from './pages/CurriculumManagementButtonScreens/ManageCourse';
import ManageSubjects from './pages/CurriculumManagementButtonScreens/ManageSubjects';
import LandingPage from './pages/LandingPageAdmin/LandingPage'; // Import the LandingPage component
import CirculationDashboard from './pages/CirculationAdmin/CirculationDashboard';
import ManageCirculation from './pages/ManageCirculation/ManageCirculation';
import ManageReservation from './pages/ManageReservation/ManageReservation';
import OverseeOverdue from './pages/OverseeOverdues/OverseeOverdues';
import CatalogingAdmin from './pages/CatalogingAdmin/CatalogingAdmin';


function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ACCESS  */}
            <Route path='/register/card' element={<LibraryCardGenerationPage />} />
            <Route path='/' element={<HomeScreen />} /> {/* Home route to display the HomeScreen */}
            <Route path='/curriculummanagement' element={<CurriculumManagement />} />
            <Route path='/curriculummanagement/manage/departments' element={<ManageDepartments />} />
            <Route path='/curriculummanagement/manage/courses' element={<ManageCourses />} />
            <Route path='/curriculummanagement/manage/subjects' element={<ManageSubjects />} />
            <Route path='/verify' element={<VerifyStudent />} /> {/* Registration route to display the Register component */}
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path='/register' element={<Register />} />
            <Route path='/landing' element={<LandingPage />} /> {/* New route for admin landing page */}
            <Route path='/circulation' element={<CirculationDashboard />} /> {/* New route for admin landing page */}
            <Route path='/manage-circulation' element={<ManageCirculation />} />
            <Route path='/manage-reservation' element={<ManageReservation />} />
            <Route path='/oversee-overdue' element={<OverseeOverdue />} />
            <Route path='/cataloging' element={<CatalogingAdmin />} />
            
            

            {/* Protected pages only registered users can access */}
            {UserService.userOnly() && (
              <>
                <Route path='/library' element={<LibraryCardGenerationPage />} />
              </>
            )}

            {/* Admin only access */}
            {UserService.adminOnly() && (
              <>
                <Route path='/admin' />
                <Route path='/library' element={<LibraryCardGenerationPage />} />
                
              </>
            )}

            {/* Default page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
