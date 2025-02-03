import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import CatalogHome from '../pages/CatalogHome';
import BookDetails from '../components/Book/BookDetails/BookDetails';
import AdvancedSearchPage from '../pages/AdvanceSearch/AdvancedSearchPage';
import BorrowingHistory from '../pages/CirculationUser/BorrowingHistory';
import BookSearch from '../pages/SearchResult/BookSearch';
const UserRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['STUDENT', 'LIBRARIAN', 'ADMIN']} redirectPath="*" />}
    >

      <Route path='browse' element={<CatalogHome />} />
      <Route path="book/:bookId" element={<BookDetails />} />
      <Route path='advanced/search' element={<AdvancedSearchPage />} />
      <Route path='library/myaccount' element={<BorrowingHistory />} />
      <Route path="catalog/management/search-title" element={<BookSearch />} />
    </Route>
  </Routes>
);

export default UserRoutes;