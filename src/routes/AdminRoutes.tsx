import { Route, Routes } from 'react-router-dom';
import CurriculumManagement from '../pages/Curriculum-Management/CurriculumManagement';
import ProtectedRoute from './ProtectedRoute';
import BookForm from '../components/Book/BookForm/BookForm';
import BookFormFast from '../components/Book/BookForm/BookFormFast';
import LandingPage from '../pages/LandingPageAdmin/LandingPage';
import CirculationDashboard from '../pages/Circulation-Management/CirculationDashboard';
import ManageCirculation from '../pages/Circulation-Management/Managers/ManageCirculation/ManageCirculation';
import OverseeOverdue from '../pages/OverseeOverdues/OverseeOverdues';
import UploadPrograms from '../pages/Curriculum-Management/Managers/UploadPrograms/UploadPrograms';
import UploadDepartments from '../pages/Curriculum-Management/Managers/UploadDepartments/UploadDepartments';
import UploadCourses from '../pages/Curriculum-Management/Managers/UploadCourses/UploadCourses';
import UploadCurriculum from '../pages/Curriculum-Management/Managers/UploadCurriculum/UploadCurriculum';
import ManageBookReference from '../pages/Curriculum-Management/Managers/BookReference/ManageBookReference';
import AcquiredItems from '../pages/Cataloging-Management/Managers/AccessionRecord/AcquiredItems';
import CatalogingAdmin from '../pages/Cataloging-Management/CatalogingAdmin/CatalogingAdmin';
import AddMARCRecord from '../pages/MARC-Record/AddMARCRecord';
import WeedingDashboard from '../pages/Cataloging-Management/Managers/Book-Weeding/WeedingDashboard';
import CriteriaDashboard from '../pages/Cataloging-Management/Managers/Book-Weeding/CriteriaDashboard';
import TransactionRecord from '../pages/Circulation-Management/Managers/ManageCirculation/TransactionRecord';
import ManageReservation from '../pages/Circulation-Management/Managers/ManageReservation/ManageReservation';
import UploadManager from '../pages/Curriculum-Management/Managers/UploadManager';
import BarcodeGenerator from '../pages/Cataloging-Management/Managers/BarcodeManagement/BarcodeGenerator';
import NoDepartments from '../pages/Curriculum-Management/Managers/UploadPrograms/NoDepartment';
import NoProgram from '../pages/Curriculum-Management/Managers/UploadCurriculum/NoProgram';
import NoCurriculum from '../pages/Curriculum-Management/Managers/UploadCourses/NoCurriculum';

const AdminRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']} redirectPath="/" />}
    >
      {/* Admin Landing Page */}
      <Route path="library" element={<LandingPage />} />

      {/* Cataloging Module  */}
      <Route path="catalog/management" element={<CatalogingAdmin />} />
      <Route path="catalog/management/accesion-record" element={<AcquiredItems />} />
      <Route path='catalog/management/marc-record/add' element={<AddMARCRecord />} />
      <Route path="catalog/management/book-weeding" element={<WeedingDashboard />} />
      <Route path="catalog/management/criteria" element={<CriteriaDashboard />} />
      <Route path="catalog/management/barcode" element={<BarcodeGenerator />} />


      {/* <Route path="book/:bookId" element={<BookDetails />} /> */}
      <Route path="catalog/management/book-form" element={<BookForm />} />
      <Route path="catalog/management/book-form-fast" element={<BookFormFast />} />


      {/* Curriculum Module  */}
      <Route path="curriculum/management" element={<CurriculumManagement />} />
      <Route path="curriculum/management/upload-manager" element={<UploadManager />} />
      <Route path='/curriculum/management/departments' element={<UploadDepartments />} />
      <Route path='/curriculum/management/programs' element={<UploadPrograms />} />
      <Route path="curriculum/management/curriculum" element={<UploadCurriculum />} />
      <Route path='/curriculum/management/courses' element={<UploadCourses />} />
      <Route path='/curriculum/management/reference' element={<ManageBookReference />} />
      <Route path='/curriculum/management/no-department' element={<NoDepartments />} />
      <Route path='/curriculum/management/no-program' element={<NoProgram />} />
      <Route path='/curriculum/management/no-curriculum' element={<NoCurriculum />} />

      {/* Ciculation Module  */}
      <Route path='circulation/management/page' element={<CirculationDashboard />} />
      <Route path='circulation/management/circulation' element={<ManageCirculation />} />
      <Route path='circulation/management/history' element={<TransactionRecord />} />
      <Route path='circulation/management/reservation' element={<ManageReservation />} />
      <Route path='circulation/management/oversee-overdue' element={<OverseeOverdue />} />







    </Route>
  </Routes>
);

export default AdminRoutes;