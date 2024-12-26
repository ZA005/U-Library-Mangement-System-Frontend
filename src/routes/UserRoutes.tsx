import { Route, Routes } from 'react-router-dom';
import LibraryCardGenerationPage from '../pages/LibraryCardGeneration/LibraryCardGenerationPage';
import ProtectedRoute from './ProtectedRoute';

const UserRoutes = () => (
  <Routes>
    <Route
      element={<ProtectedRoute allowedRoles={['LIBRARIAN']} redirectPath="/" />}
    >
      <Route path="/library/card/" element={<LibraryCardGenerationPage />} />
      {/* <Route path="user/library" element={<LibraryCard />} /> */}
    </Route>
  </Routes>
);

export default UserRoutes;