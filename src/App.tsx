import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen'; // Import the HomeScreen component
import { AuthProvider } from './contexts/AuthContext';
import LibraryCardGenerationPage from './pages/LibraryCardGeneration/LibraryCardGenerationPage';
import Register from './components/RegistrationForm/RegistrationForm';
import VerifyOtp from './components/Verify/VerifyOtp';
import VerifyStudent from './components/Verify/VerifyUser';
import UserService from './services/UserService';

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* PUBLIC ACCESS  */}
            <Route path='/register/card' element={<LibraryCardGenerationPage />} />
            <Route path='/' element={<HomeScreen />} /> {/* Home route to display the HomeScreen */}

            <Route path='/verify' element={<VerifyStudent />} /> {/* Registration route to display the Register component */}
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path='/register' element={<Register />} />

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