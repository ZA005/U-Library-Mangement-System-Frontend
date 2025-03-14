import { Routes, Route } from "react-router-dom";
import * as Pages from "../pages";
import { PROTECTED_ROUTES } from "../config/routeConfig";
import PrivateRoute from "./PrivateRoute";

const ProtectedRoutes = () => {
    return (
        <Routes>
            <Route
                path={PROTECTED_ROUTES.BROWSE}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "ADMIN"]}>
                    <Pages.Browse />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.NEWLYACQUIRED}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "ADMIN"]}>
                    <Pages.NewlyAcquiredBooks />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.BROWSEALLBOOKS}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "ADMIN"]}>
                    <Pages.BrowseAllBooks />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.CATALOG}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.Catalog />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.BOOKINFORMATION}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "ADMIN"]}>
                    <Pages.BookInformation />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.ACCESSION}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.AccessionRecord />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_MANAGER}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.UploadManager />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_DEPARTMENT}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.UploadDepartment />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_PROGRAM}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.UploadProgram />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_CURRICULUM}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.UploadCurriculum />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_COURSE}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                        <Pages.UploadCourse />
                    </PrivateRoute>
                }
            />






            {/* Default fallback to PageNotFound */}
            <Route path="*" element={<Pages.PageNotFound />} />
        </Routes>
    );
};

export default ProtectedRoutes;
