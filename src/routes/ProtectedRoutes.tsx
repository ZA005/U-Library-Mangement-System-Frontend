import { Routes, Route } from "react-router-dom";
import * as Pages from "../pages";
import { PROTECTED_ROUTES } from "../config/routeConfig";
import PrivateRoute from "./PrivateRoute";

const ProtectedRoutes = () => {
    return (
        <Routes>
            <Route
                path={PROTECTED_ROUTES.BROWSE}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "LIBRARY DIRECTOR", "PROGRAMHEAD", "FACULTY"]}>
                    <Pages.Browse />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.NEWLYACQUIRED}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "LIBRARYDIRECTOR", "PROGRAMHEAD", "FACULTY"]}>
                    <Pages.NewlyAcquiredBooks />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.BROWSEALLBOOKS}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "LIBRARYDIRECTOR", "PROGRAMHEAD", "FACULTY"]}>
                    <Pages.BrowseAllBooks />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.CATALOG}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.Catalog />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.BOOKINFORMATION}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "LIBRARYDIRECTOR", "PROGRAMHEAD", "FACULTY"]}>
                    <Pages.BookInformation />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.ADVANCESEARCH}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "LIBRARYDIRECTOR"]}>
                    <Pages.AdvanceSearch />
                </PrivateRoute>}
            />

            <Route
                path={PROTECTED_ROUTES.BOOKWEEDING}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.BookWeeding />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.WEEDINGCRITERIA}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.WeedingCriteria />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.QRGENERATE}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.QRGenerate />
                    </PrivateRoute>
                }
            />


            <Route
                path={PROTECTED_ROUTES.ACCESSION}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.AccessionRecord />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_MANAGER}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.UploadManager />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_DEPARTMENT}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.UploadDepartment />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_PROGRAM}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.UploadProgram />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_CURRICULUM}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.UploadCurriculum />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.UPLOAD_COURSE}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.UploadCourse />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.CURRICULUM_BROWSE}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN", "STUDENT", "PROGRAMHEAD", "FACULTY"]}>
                        <Pages.CurriculumBrowse />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.CURRICULUM_PROGRAM}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN", "STUDENT", "PROGRAMHEAD", "FACULTY"]}>
                        <Pages.CurriculumProgram />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.BOOK_REFERENCING}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR", "PROGRAMHEAD"]}>
                        <Pages.BookReferencing />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.CIRCULATION}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.ManageCirculation />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.TRANSACTION_HISTORY}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.TransactionHistory />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.OVERDUES}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.Overdues />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.RESERVATION}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "LIBRARYDIRECTOR"]}>
                        <Pages.ManageReservation />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.ACCOUNT_OVERVIEW}
                element={
                    <PrivateRoute allowedRoles={["LIBRARIAN", "ADMIN", "STUDENT", "PROGRAMHEAD", "FACULTY"]}>
                        <Pages.AccountOverview />
                    </PrivateRoute>
                }
            />

            <Route
                path={PROTECTED_ROUTES.INDIVIDUAL_HISTORY}
                element={<PrivateRoute allowedRoles={["STUDENT", "LIBRARIAN", "LIBRARY DIRECTOR", "PROGRAMHEAD", "FACULTY"]}>
                    <Pages.IndividualHistory />
                </PrivateRoute>
                }
            />

            {/* Default fallback to PageNotFound */}
            <Route path="*" element={<Pages.PageNotFound />} />
        </Routes>
    );
};

export default ProtectedRoutes;
