import { Route, Routes } from "react-router-dom";
import * as Pages from "../pages"
import { PUBLIC_ROUTES } from "../config/routeConfig";
import PrivateRoute from "./PrivateRoute";

const PublicRoutes = () => {
    return (
        <Routes>
            <Route
                path={PUBLIC_ROUTES.TEST}
                element={<PrivateRoute allowedRoles={["STUDENT"]}>
                    <Pages.HomeScreen />
                </PrivateRoute>}
            />
            <Route path="*" element={<Pages.PageNotFound />} />
        </Routes>
    )
}

export default PublicRoutes