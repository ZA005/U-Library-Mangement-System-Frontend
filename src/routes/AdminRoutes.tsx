import { Route, Routes } from 'react-router-dom';
import CurriculumManagement from '../pages/Curriculum-Management/CurriculumManagement';
import ProtectedRoute from './ProtectedRoute';

const AdminRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['LIBRARIAN']} redirectPath="/login" />}
    >
      <Route path="curriculum/management/page" element={<CurriculumManagement />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
