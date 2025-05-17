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
                { label: "QR Code Generator", path: PROTECTED_ROUTES.QRGENERATE },
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
    LIBRARYDIRECTOR: [
        {
            label: "Catalog",
            children: [
                { label: "Accession Record", path: PROTECTED_ROUTES.ACCESSION },
                { label: "Book Weeding", path: PROTECTED_ROUTES.BOOKWEEDING },
                { label: "QR Code Generator", path: PROTECTED_ROUTES.QRGENERATE },
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
                { label: "Browse", path: PROTECTED_ROUTES.CURRICULUM_BROWSE },
                { label: "Upload Manager", path: PROTECTED_ROUTES.UPLOAD_MANAGER },
                { label: "Book Referencing", path: PROTECTED_ROUTES.BOOK_REFERENCING },
            ],
            icon: CurriculumIcon,
        },
        { label: "Account Management", path: PROTECTED_ROUTES.ACCOUNT_OVERVIEW, icon: UserIcon },
    ],
    STUDENT: [
        {
            label: "Curriculum",
            children: [
                { label: "Browse", path: PROTECTED_ROUTES.CURRICULUM_BROWSE },
            ],
            icon: CurriculumIcon,
        },
        { label: "Account Management", path: PROTECTED_ROUTES.ACCOUNT_OVERVIEW, icon: UserIcon },
    ],
    PROGRAMHEAD: [
        {
            label: "Curriculum",
            children: [
                { label: "Browse", path: PROTECTED_ROUTES.CURRICULUM_BROWSE },
                { label: "Book Referencing", path: PROTECTED_ROUTES.BOOK_REFERENCING },
            ],
            icon: CurriculumIcon,
        },
        { label: "Account Management", path: PROTECTED_ROUTES.ACCOUNT_OVERVIEW, icon: UserIcon },
    ],
    DEAN: [
        {
            label: "Curriculum",
            children: [
                { label: "Browse", path: PROTECTED_ROUTES.CURRICULUM_BROWSE },
                { label: "Book Referencing", path: PROTECTED_ROUTES.BOOK_REFERENCING },
            ],
            icon: CurriculumIcon,
        },
        { label: "Account Management", path: PROTECTED_ROUTES.ACCOUNT_OVERVIEW, icon: UserIcon },
    ],
    FACULTY: [
        {
            label: "Curriculum",
            children: [
                { label: "Browse", path: PROTECTED_ROUTES.CURRICULUM_BROWSE },
            ],
            icon: CurriculumIcon,
        },
        { label: "Account Management", path: PROTECTED_ROUTES.ACCOUNT_OVERVIEW, icon: UserIcon },
    ],
};
