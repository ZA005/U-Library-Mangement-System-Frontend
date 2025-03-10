export const GENERAL_ROUTES = {
    HOME: "/",
    REGISTER: "/activate/:user_id",
    ELIBCARD: "/:user_id/e-card",
    NOT_FOUND: "*",
};

export const PROTECTED_ROUTES = {
    CATALOG: "/library/catalog",
    ACCESSION: "/library/accession",
    BROWSE: "/browse",
    USER_BROWSE: "/user/browse",
    CURRICULUM: "/curriculum",
    UPLOAD_MANAGER: "/curriculum/upload-manager",
    BOOK_REFERENCING: "/curriculum/book-referencing",
}