import { Route, Routes } from 'react-router-dom';
import LibraryCardGenerationPage from '../pages/LibraryCardGeneration/LibraryCardGenerationPage';
import ProtectedRoute from './ProtectedRoute';

const UserRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['user', 'admin']} redirectPath="/login" />}
    >
      <Route path="user/library/card/" element={<LibraryCardGenerationPage />} />
      {/* <Route path="user/library" element={<LibraryCard />} /> */}
    </Route>
  </Routes>
);

export default UserRoutes;
