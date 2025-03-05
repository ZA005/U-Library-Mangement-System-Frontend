import { Routes, Route } from "react-router-dom";
import * as Pages from "../pages";
import { PROTECTED_ROUTES } from "../config/routeConfig";
import PrivateRoute from "./PrivateRoute";

const ProtectedRoutes = () => {
    return (
        <Routes>
            {/* Only LIBRARIAN and ADMIN can access the catalog */}
            <Route
                path={PROTECTED_ROUTES.CATALOG}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.Catalog />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.ACCESSION}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.AccessionRecord />
                    </PrivateRoute>
                }
            />

            {/* Default fallback to PageNotFound */}
            <Route path="*" element={<Pages.PageNotFound />} />
        </Routes>
    );
};

export default ProtectedRoutes;
