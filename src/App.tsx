import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { checkUserCredentials } from './services/UserService';
import ListUserComponent from './components/ListUserComponent';
import RegistrationPage from './components/RegisterComponent';

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

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
          <Route path='/register' element={<RegistrationPage />}></Route>
          <Route path='/' element={<ListUserComponent />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
