import { Route, Routes } from 'react-router-dom';
import CurriculumManagement from '../pages/Curriculum-Management/CurriculumManagement';
import ProtectedRoute from './ProtectedRoute';
import BookSearch from '../pages/BookSearch/BookSearch';
import BookForm from '../components/Book/BookForm/BookForm';
import LandingPage from '../pages/LandingPageAdmin/LandingPage';
import CirculationDashboard from '../pages/CirculationAdmin/CirculationDashboard';
import ManageCirculation from '../pages/ManageCirculation/ManageCirculation';
import OverseeOverdue from '../pages/OverseeOverdues/OverseeOverdues';
import ManageCourses from '../pages/Curriculum-Management/Managers/ManagePrograms';
import ManageDepartments from '../pages/Curriculum-Management/Managers/ManageDepartments';
import ManageSubjects from '../pages/Curriculum-Management/Managers/ManageSubjects';
import ManageBookReference from '../pages/Curriculum-Management/Managers/ManageBookReference';

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
      <Route path='/curriculum/management/departments' element={<ManageDepartments />} />
      <Route path='/curriculum/management/programs' element={<ManageCourses />} />
      <Route path='/curriculum/management/subjects' element={<ManageSubjects />} />
      <Route path='/curriculum/management/reference' element={<ManageBookReference />} />

      {/* Ciculation Module  */}
      <Route path='circulation/management/page' element={<CirculationDashboard />} />
      <Route path='manage-circulation' element={<ManageCirculation />} />
      <Route path='oversee-overdue' element={<OverseeOverdue />} />







    </Route>
  </Routes>
);

export default AdminRoutes;