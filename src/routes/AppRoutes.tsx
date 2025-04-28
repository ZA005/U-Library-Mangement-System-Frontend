import { Routes, Route, Navigate } from "react-router-dom";
import { GENERAL_ROUTES, PROTECTED_ROUTES } from "../config/routeConfig";
import { useAuth } from "../contexts/AuthContext";
import * as Pages from "./../pages"
import MainLayout from "../layouts/MainLayout";
import loadable from "@loadable/component";

const ProtectedRoutes = loadable(() => import("./ProtectedRoutes"))
// const PublicRoutes = loadable(() => import("./GeneralRoutes"))

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return <Pages.HomeScreen />;

    switch (role) {
      case "STUDENT":
      case "LIBRARIAN":
      case "FACULTY":
      case "PROGRAMHEAD":
      case "ADMIN":
        return <Navigate to={PROTECTED_ROUTES.BROWSE} replace />;
      default:
        return <Pages.HomeScreen />;
    }
  };



  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route
          path={GENERAL_ROUTES.HOME}
          element={isAuthenticated ? getDefaultRoute() : <Pages.HomeScreen />}
        />

        <Route
          path={GENERAL_ROUTES.REGISTER}
          element={isAuthenticated ? getDefaultRoute() : <Pages.ActivateUser />}
        />

        <Route
          path={GENERAL_ROUTES.ELIBCARD}
          element={isAuthenticated ? getDefaultRoute() : <Pages.AccountLibraryCard />}
        />

        {/* <Route
          path={ROUTES.TEST}
          element={isAuthenticated ? getDefaultRoute() : <Pages.TestingPage />}
        /> */}
      </Route>

      {/* PROTECTED ROUTES WRAPPED IN MAINLAYOUT */}
      <Route element={<MainLayout />}>
        <Route path={"/*"} element={<ProtectedRoutes />} />
      </Route>

      {/* DEFAULT CATCH-ALL ROUTE */}
      <Route path={GENERAL_ROUTES.NOT_FOUND} element={<Pages.PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
