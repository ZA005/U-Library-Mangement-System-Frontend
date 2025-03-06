export const GENERAL_ROUTES = {
    HOME: "/",
    REGISTER: "/activate/:user_id",
    ELIBCARD: "/:user_id/e-card",
    NOT_FOUND: "*",
};

export const PROTECTED_ROUTES = {
    ADMIN: "/admin",
    CATALOG: "/library/catalog",
    ACCESSION: "/library/accession",
    BROWSE: "/browse",
    USER: "/user",
    USER_BROWSE: "/user/browse",
}