import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routeConfig";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import HomeScreen from "../pages/HomeScreen";
import PageNotFound from "../pages/PageNotFound";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  const getDefaultRoute = () => {
    if (role === "STUDENT") return <Navigate to={ROUTES.USER_BROWSE} />;
    if (role === "LIBRARIAN" || role === "ADMIN")
      return <Navigate to={ROUTES.ADMIN_LIBRARY} />;
    return <HomeScreen />;
  };

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route
          path={ROUTES.HOME}
          element={isAuthenticated ? getDefaultRoute() : <HomeScreen />}
        />
      </Route>

      {/* PROTECTED ROUTES WRAPPED IN MAINLAYOUT */}
      <Route element={<MainLayout />}>
        <Route
          element={<PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]} />}
        >
          {/* <Route path={ROUTES.ADMIN + "/*"} element={<AdminRoutes />} /> */}
        </Route>

        <Route
          element={
            <PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "ADMIN"]} />
          }
        >
          {/* <Route path={ROUTES.USER + "/*"} element={<UserRoutes />} /> */}
        </Route>
      </Route>

      {/* DEFAULT CATCH-ALL ROUTE */}
      <Route path={ROUTES.NOT_FOUND} element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
