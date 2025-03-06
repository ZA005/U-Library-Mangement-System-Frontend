import { Route, Routes } from "react-router-dom";
import * as Pages from "../pages"
import { GENERAL_ROUTES } from "../config/routeConfig";
import PrivateRoute from "./PrivateRoute";

const PublicRoutes = () => {
    return (
        <Routes>
            <Route
                path={GENERAL_ROUTES.BROWSE}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "ADMIN"]}>
                    <Pages.Browse />
                </PrivateRoute>}
            />
            <Route path="*" element={<Pages.PageNotFound />} />
        </Routes>
    )
}

export default PublicRoutes