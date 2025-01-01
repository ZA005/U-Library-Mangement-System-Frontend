import { Route, Routes } from 'react-router-dom';
import LibraryCardGenerationPage from '../pages/LibraryCardGeneration/LibraryCardGenerationPage';
import ProtectedRoute from './ProtectedRoute';
import CatalogHome from '../pages/CatalogHome';
import BookDetails from '../components/BookDetails/BookDetails';

const UserRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['STUDENT', 'LIBRARIAN']} redirectPath="*" />}
    >
      <Route path="library/card/" element={<LibraryCardGenerationPage />} />
      <Route path='browse' element={<CatalogHome />} />
      <Route path="book/:bookId" element={<BookDetails />} />
      {/* <Route path="user/library" element={<LibraryCard />} /> */}
    </Route>
  </Routes>
);

export default UserRoutes;