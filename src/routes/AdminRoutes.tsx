import { Route, Routes } from 'react-router-dom';
import CurriculumManagement from '../pages/Curriculum-Management/CurriculumManagement';
import ProtectedRoute from './ProtectedRoute';
import BookSearch from '../pages/SearchResult/BookSearch';
import BookForm from '../components/Book/BookForm/BookForm';
import BookFormFast from '../components/Book/BookForm/BookFormFast';
import LandingPage from '../pages/LandingPageAdmin/LandingPage';
import CirculationDashboard from '../pages/CirculationAdmin/CirculationDashboard';
import ManageCirculation from '../pages/ManageCirculation/ManageCirculation';
import OverseeOverdue from '../pages/OverseeOverdues/OverseeOverdues';
import ManageCourses from '../pages/Curriculum-Management/Managers/ManagePrograms';
import ManageDepartments from '../pages/Curriculum-Management/Managers/ManageDepartments';
import ManageSubjects from '../pages/Curriculum-Management/Managers/ManageSubjects';
import ManageBookReference from '../pages/Curriculum-Management/Managers/ManageBookReference';
import AcquiredItems from '../pages/Cataloging-Management/Managers/AccessionRecord/AcquiredItems';
import CatalogingAdmin from '../pages/Cataloging-Management/CatalogingAdmin/CatalogingAdmin';
import AddMARCRecord from '../pages/MARC-Record/AddMARCRecord';
import UploadCourseReference from '../pages/Curriculum-Management/Managers/UploadCourseReference';
import TransactionRecord from '../pages/ManageCirculation/TransactionRecord';

const AdminRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['LIBRARIAN']} redirectPath="/" />}
    >
      {/* Admin Landing Page */}
      <Route path="library" element={<LandingPage />} />

      {/* Cataloging Module  */}
      <Route path="catalog/management" element={<CatalogingAdmin />} />
      <Route path="catalog/management/accesion-record" element={<AcquiredItems />} />
      <Route path='catalog/management/marc-record/add' element={<AddMARCRecord />} />
      <Route path="catalog/management/search-title" element={<BookSearch />} />
      {/* <Route path="book/:bookId" element={<BookDetails />} /> */}
      <Route path="catalog/management/book-form" element={<BookForm />} />
      <Route path="catalog/management/book-form-fast" element={<BookFormFast />} />


      {/* Curriculum Module  */}
      <Route path="curriculum/management/page" element={<CurriculumManagement />} />
      <Route path="curriculum/management/upload" element={<UploadCourseReference />} />
      <Route path='/curriculum/management/departments' element={<ManageDepartments />} />
      <Route path='/curriculum/management/programs' element={<ManageCourses />} />
      <Route path='/curriculum/management/subjects' element={<ManageSubjects />} />
      <Route path='/curriculum/management/reference' element={<ManageBookReference />} />

      {/* Ciculation Module  */}
      <Route path='circulation/management/page' element={<CirculationDashboard />} />
      <Route path='manage-circulation' element={<ManageCirculation />} />
      <Route path='circulation/management/history' element={<TransactionRecord />} />
      <Route path='oversee-overdue' element={<OverseeOverdue />} />







    </Route>
  </Routes>
);

export default AdminRoutes;