import loadable from "@loadable/component"
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./routeConfig"

const HomeIcon = loadable(() => import("@mui/icons-material/home"));

export const menuItems = {
    LIBRARIAN: [
        { label: "Home", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
        { label: "Catalog", path: PROTECTED_ROUTES.ADMIN + PROTECTED_ROUTES.CATALOG, icon: HomeIcon },
        { label: "Circulation", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
    ],
    STUDENT: [
        { label: "Home", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
        { label: "Account Management", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
    ],
    PROGRAMHEAD: [
        { label: "Curriculum", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
    ],
    FACULTY: [
        { label: "Curriculum", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
        { label: "Browse Books", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
        { label: "Home", path: PUBLIC_ROUTES.HOME, icon: HomeIcon },
    ],
}