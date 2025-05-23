export const GENERAL_ROUTES = {
    HOME: "/",
    REGISTER: "/activate/:user_id",
    ELIBCARD: "/:user_id/e-card",
    NOT_FOUND: "*",
};

export const PROTECTED_ROUTES = {
    //////////////////////////////////////

    BROWSE: "/library/browse",
    ACCOUNT_OVERVIEW: "/library/account",
    //////////////////////////////////////

    CATALOG: "/library/accession/catalog/:isbn",
    ACCESSION: "/library/accession",
    NEWLYACQUIRED: "/library/newly-acquired-books",
    BROWSEALLBOOKS: "/library/browse/all",
    BOOKINFORMATION: "/library/book/:isbn",
    ADVANCESEARCH: "/library/advance-search",
    BOOKWEEDING: "/library/book-weeding",
    WEEDINGCRITERIA: "/library/book-weeding/criteria",
    QRGENERATE: "/library/qr-generate",
    //////////////////////////////////////

    CURRICULUM: "/curriculum",
    CURRICULUM_BROWSE: "/curriculum/browse",
    CURRICULUM_PROGRAM: "/curriculum/:program",
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
    INDIVIDUAL_HISTORY: "/:user_id/transaction-history",
    OVERDUES: "/circulation/overdues",
}