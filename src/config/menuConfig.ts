import loadable from "@loadable/component";
import { PROTECTED_ROUTES, GENERAL_ROUTES } from "./routeConfig";

const AcquisitionIcon = loadable(() => import("lucide-react").then((m) => ({ default: m.ClipboardPen })));
const CatalogIcon = loadable(() => import("lucide-react").then((m) => ({ default: m.LibraryBig })));
const CurriculumIcon = loadable(() => import("lucide-react").then((m) => ({ default: m.BookOpenCheck })));
const CirculationIcon = loadable(() => import("lucide-react").then((m) => ({ default: m.ArrowLeftRight })));
const UserIcon = loadable(() => import("lucide-react").then((m) => ({ default: m.User })));

export const menuItems = {
    LIBRARIAN: [
        {
            label: "Catalog",
            children: [
                { label: "Accession Record", path: PROTECTED_ROUTES.ACCESSION },
                { label: "Book Weeding", path: PROTECTED_ROUTES.BOOKWEEDING },
                { label: "Barcode Generator", path: PROTECTED_ROUTES.BOOK_REFERENCING },
            ],
            icon: CatalogIcon,
        },
        {
            label: "Circulation",
            children: [
                { label: "Transaction History", path: PROTECTED_ROUTES.TRANSACTION_HISTORY },
                { label: "Manage Circulation", path: PROTECTED_ROUTES.CIRCULATION },
                { label: "Reservations", path: PROTECTED_ROUTES.RESERVATION },
                { label: "Oversee Overdues", path: PROTECTED_ROUTES.OVERDUES },
            ],
            icon: CirculationIcon
        },
        {
            label: "Curriculum",
            children: [
                { label: "Upload Manager", path: PROTECTED_ROUTES.UPLOAD_MANAGER },
                { label: "Book Referencing", path: PROTECTED_ROUTES.BOOK_REFERENCING },
            ],
            icon: CurriculumIcon,
        },
    ],
    ADMIN: [
        {
            label: "Catalog",
            children: [
                { label: "Accession Record", path: PROTECTED_ROUTES.ACCESSION },
                { label: "Book Weeding", path: PROTECTED_ROUTES.BOOKWEEDING },
                { label: "Barcode Generator", path: PROTECTED_ROUTES.BOOK_REFERENCING },
            ],
            icon: CatalogIcon,
        },
        {
            label: "Circulation",
            children: [
                { label: "Transaction History", path: PROTECTED_ROUTES.TRANSACTION_HISTORY },
                { label: "Manage Circulation", path: PROTECTED_ROUTES.CIRCULATION },
                { label: "Reservations", path: PROTECTED_ROUTES.RESERVATION },
                { label: "Oversee Overdues", path: PROTECTED_ROUTES.OVERDUES },
            ],
            icon: CirculationIcon
        },
        {
            label: "Curriculum",
            children: [
                { label: "Upload Manager", path: PROTECTED_ROUTES.UPLOAD_MANAGER },
                { label: "Book Referencing", path: PROTECTED_ROUTES.BOOK_REFERENCING },
            ],
            icon: CurriculumIcon,
        },
    ],
    STUDENT: [
        { label: "Account Management", path: GENERAL_ROUTES.HOME, icon: UserIcon },
    ],
    PROGRAMHEAD: [
        { label: "Curriculum", path: GENERAL_ROUTES.HOME, icon: CurriculumIcon },
    ],
    FACULTY: [
        { label: "Catalog", path: PROTECTED_ROUTES.CATALOG, icon: CatalogIcon },
        { label: "Circulation", path: GENERAL_ROUTES.HOME, icon: CirculationIcon },
        { label: "Accession Record", path: PROTECTED_ROUTES.ACCESSION, icon: AcquisitionIcon },
        { label: "Curriculum", path: GENERAL_ROUTES.HOME, icon: CurriculumIcon },
    ],
};
