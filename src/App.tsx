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
    </>
  )
}

export default App
