import loadable from "@loadable/component"
import { PROTECTED_ROUTES, GENERAL_ROUTES } from "./routeConfig"

const HomeIcon = loadable(() => import("@mui/icons-material/home"));

export const menuItems = {
    LIBRARIAN: [
        { label: "Home", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
        { label: "Catalog", path: PROTECTED_ROUTES.CATALOG, icon: HomeIcon },
        { label: "Circulation", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
        { label: "Accession Record", path: PROTECTED_ROUTES.ACCESSION, icon: HomeIcon },
    ],
    STUDENT: [
        { label: "Home", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
        { label: "Account Management", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
    ],
    PROGRAMHEAD: [
        { label: "Curriculum", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
    ],
    FACULTY: [
        { label: "Curriculum", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
        { label: "Browse Books", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
        { label: "Home", path: GENERAL_ROUTES.HOME, icon: HomeIcon },
    ],
}