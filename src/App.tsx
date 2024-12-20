import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen'; // Import the HomeScreen component
import { AuthProvider } from './contexts/AuthContext';
import LibraryCardGenerationPage from './pages/LibraryCardGeneration/LibraryCardGenerationPage';
import Register from './components/RegistrationForm/RegistrationForm';
import VerifyOtp from './pages/VerifyOtp';
import VerifyStudent from './pages/VerifyUser';
import UserService from './services/UserService';
import BookSearch from './pages/BookSearch';
import BookDetails from './components/BookDetails/BookDetails';
import BookForm from './components/BookForm/BookForm';
import PageNotFound from './components/PageNotFound/PageNotFound';
// import SearchBooks from './pages/SearchBooks';
// import CatalogingModule from './components/CatalogingModule/CatalogModule';
// import MetadataSearch from './pages/SearchBooks';

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
            <Route path='/search-book' element={<BookSearch />}></Route>
            {/* <Route path='/search-book' element={<SearchBooks />}></Route> */}
            {/* Protected pages only registered users can access */}
            {UserService.userOnly() && (
              <>
                <Route path='/library' element={<LibraryCardGenerationPage />} />
                {/* <Route path='/search-book' element={<BookSearch />}></Route> */}
                {/* to be remove */}
                {/* <Route path="/book/:bookId" element={<BookDetails />} />
                <Route path="/book-form" element={<BookForm />}></Route> */}
              </>

            )}

            {/* Admin only access */}
            {UserService.adminOnly() && (
              <>
                <Route path='/admin' />
                <Route path='/library' element={<LibraryCardGenerationPage />} />
                {/* <Route path='/search-book' element={<BookSearch />}></Route> */}
                <Route path="/book/:bookId" element={<BookDetails />} />
                <Route path="/book-form" element={<BookForm />}></Route>
              </>

            )}

            {/* Default page */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
