import loadable from "@loadable/component"
import { ROUTES } from "./routeConfig"

const HomeIcon = loadable(() => import("@mui/icons-material/home"));

export const menuItems = {
    LIBRARIAN: [
        { label: "Home", path: ROUTES.HOME, icon: HomeIcon },
        { label: "Catalog", path: ROUTES.ADMIN + ROUTES.CATALOG, icon: HomeIcon },
        { label: "Circulation", path: ROUTES.HOME, icon: HomeIcon },
    ],
    STUDENT: [
        { label: "Home", path: ROUTES.HOME, icon: HomeIcon },
        { label: "Account Management", path: ROUTES.HOME, icon: HomeIcon },
    ],
    PROGRAMHEAD: [
        { label: "Curriculum", path: ROUTES.HOME, icon: HomeIcon },
    ],
    FACULTY: [
        { label: "Curriculum", path: ROUTES.HOME, icon: HomeIcon },
        { label: "Browse Books", path: ROUTES.HOME, icon: HomeIcon },
        { label: "Home", path: ROUTES.HOME, icon: HomeIcon },
    ],
}