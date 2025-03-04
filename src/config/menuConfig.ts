import loadable from "@loadable/component"
import { ROUTES } from "./routeConfig"

const HomeIcon = loadable(() => import("@mui/icons-material/home"));

export const menuItems = {
    LIBRARIAN: [
        { label: "Home", path: ROUTES.HOME, icon: HomeIcon },
    ],
    STUDENT: [
        { label: "Home", path: ROUTES.HOME, icon: HomeIcon },
    ],
    PROGRAMHEAD: [
        { label: "Home", path: ROUTES.HOME, icon: HomeIcon },
    ],
    FACULTY: [
        { label: "Home", path: ROUTES.HOME, icon: HomeIcon },
    ],
}