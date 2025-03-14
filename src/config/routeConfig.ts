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
    //////////////////////////////////////

    CURRICULUM: "/curriculum",
    UPLOAD_MANAGER: "/curriculum/upload-manager",
    UPLOAD_DEPARTMENT: "/curriculum/upload-department",
    BOOK_REFERENCING: "/curriculum/book-referencing",

    //////////////////////////////////////

}