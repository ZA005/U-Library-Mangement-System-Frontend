<<<<<<< HEAD
<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserComponents from './components/UserComponents'
=======
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { checkUserCredentials } from './services/UserService';
import RegistrationPage from './components/RegisterComponent';
import HomeScreen from './pages/HomeScreen';
import LibraryCardGenerationPage from './pages/LibraryCardGeneration/LibraryCardGenerationPage';
function App() {
  const handleLogin = async (libraryCardNumber: string, password: string) => {
    try {
      const response = await checkUserCredentials({ libraryCardNumber, password });
      if (response) {
        console.log('Login successful', response);
        // Redirect to a different page or save user data
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };
>>>>>>> Stashed changes

function App() {
  return (
    <>
<<<<<<< Updated upstream
    <UserComponents /> 
=======
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/register/card' element={<LibraryCardGenerationPage />} />
          <Route path='/' element={<HomeScreen />} /> {/* Home route to display the HomeScreen */}
        </Routes>
      </BrowserRouter>
>>>>>>> Stashed changes
=======
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen'; // Import the HomeScreen component
import { AuthProvider } from './contexts/AuthContext';
import LibraryCardGenerationPage from './pages/LibraryCardGeneration/LibraryCardGenerationPage';
import Register from './components/RegistrationForm/RegistrationForm';
import VerifyOtp from './pages/VerifyOtp';
import VerifyStudent from './pages/VerifyUser';
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
>>>>>>> dc2e65a644277148d2b23ab99f5c725aa97ccce4
    </>
  );
}

export default App;
