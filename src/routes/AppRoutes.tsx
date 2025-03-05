import { Routes, Route, Navigate } from "react-router-dom";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "../config/routeConfig";
import { useAuth } from "../contexts/AuthContext";
import * as Pages from "./../pages"
import MainLayout from "../layouts/MainLayout";
import loadable from "@loadable/component";

const ProtectedRoutes = loadable(() => import("./ProtectedRoutes"))
const PublicRoutes = loadable(() => import("./PublicRoutes"))

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return <Pages.HomeScreen />;

    switch (role) {
      case "STUDENT":
        return <Navigate to={PROTECTED_ROUTES.USER_BROWSE} replace />;
      case "LIBRARIAN":
        return <Pages.TestingPage />;
      case "ADMIN":
        return <Navigate to={PROTECTED_ROUTES.ADMIN} replace />;
      default:
        return <Pages.HomeScreen />;
    }
  };



  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route
          path={PUBLIC_ROUTES.HOME}
          element={isAuthenticated ? getDefaultRoute() : <Pages.HomeScreen />}
        />

        <Route
          path={PUBLIC_ROUTES.REGISTER}
          element={isAuthenticated ? getDefaultRoute() : <Pages.ActivateUser />}
        />

        <Route
          path={PUBLIC_ROUTES.ELIBCARD}
          element={isAuthenticated ? getDefaultRoute() : <Pages.AccountLibraryCard />}
        />

        {/* <Route
          path={ROUTES.TEST}
          element={isAuthenticated ? getDefaultRoute() : <Pages.TestingPage />}
        /> */}
      </Route>

      {/* PROTECTED ROUTES WRAPPED IN MAINLAYOUT */}
      <Route element={<MainLayout />}>
        <Route path={PROTECTED_ROUTES.ADMIN + "/*"} element={<ProtectedRoutes />} />
        <Route path={PROTECTED_ROUTES.USER + "/*"} element={<PublicRoutes />} />
      </Route>

      {/* DEFAULT CATCH-ALL ROUTE */}
      <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<Pages.PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
