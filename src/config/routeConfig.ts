export const GENERAL_ROUTES = {
    HOME: "/",
    REGISTER: "/activate/:user_id",
    ELIBCARD: "/:user_id/e-card",
    BROWSE: "/browse",
    NOT_FOUND: "*",
};

export const PROTECTED_ROUTES = {
    ADMIN: "/admin",
    CATALOG: "/library/catalog",
    ACCESSION: "/library/accession",

    USER: "/user",
    USER_BROWSE: "/user/browse",
}