import { Route, Routes } from 'react-router-dom';
import CurriculumManagement from '../pages/Curriculum-Management/CurriculumManagement';
import ProtectedRoute from './ProtectedRoute';
import BookSearch from '../pages/BookSearch';
import BookForm from '../components/BookForm/BookForm';
import LandingPage from '../pages/LandingPageAdmin/LandingPage';
import CirculationDashboard from '../pages/CirculationAdmin/CirculationDashboard';
import ManageCirculation from '../pages/ManageCirculation/ManageCirculation';

const AdminRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['LIBRARIAN']} redirectPath="/" />}
    >
      {/* Admin Landing Page */}
      <Route path="library" element={<LandingPage />} />

      {/* Cataloging Module  */}
      <Route path="catalog/management/search-title" element={<BookSearch />} />
      {/* <Route path="book/:bookId" element={<BookDetails />} /> */}
      <Route path="book-form" element={<BookForm />} />

      {/* Curriculum Module  */}
      <Route path="curriculum/management/page" element={<CurriculumManagement />} />

      {/* Ciculation Module  */}
      <Route path='circulation/management/page' element={<CirculationDashboard />} />
      <Route path='manage-circulation' element={<ManageCirculation />} />






    </Route>
  </Routes>
);

export default AdminRoutes;
