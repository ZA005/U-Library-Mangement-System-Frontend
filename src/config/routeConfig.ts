export const GENERAL_ROUTES = {
    HOME: "/",
    REGISTER: "/activate/:user_id",
    ELIBCARD: "/:user_id/e-card",
    NOT_FOUND: "*",
};

export const PROTECTED_ROUTES = {
    //////////////////////////////////////

    BROWSE: "/library/browse",

    //////////////////////////////////////

    CATALOG: "/library/accession/catalog/:isbn",
    ACCESSION: "/library/accession",
    NEWLYACQUIRED: "/library/newly-acquired-books",
    BROWSEALLBOOKS: "/library/browse/all",
    BOOKINFORMATION: "/library/book/:isbn",
    ADVANCESEARCH: "/library/advance-search",
    //////////////////////////////////////

    CURRICULUM: "/curriculum",
    CURRICULUM_BROWSE: "/curriculum/browse",
    UPLOAD_MANAGER: "/curriculum/upload-manager",
    UPLOAD_DEPARTMENT: "/curriculum/upload/department",
    UPLOAD_PROGRAM: "/curriculum/upload/program",
    UPLOAD_CURRICULUM: "/curriculum/upload/curriculum",
    UPLOAD_COURSE: "/curriculum/upload/course",
    BOOK_REFERENCING: "/curriculum/book-referencing",

    //////////////////////////////////////
    CIRCULATION: "/circulation",
    RESERVATION: "/circulation/reservation",
    TRANSACTION_HISTORY: "/circulation/transaction-history",
    OVERDUES: "/circulation/overdues",
}