export const PUBLIC_ROUTES = {
    HOME: "/",
    REGISTER: "/activate/:user_id",
    ELIBCARD: "/:user_id/e-card",
    NOT_FOUND: "*",
    TEST: "/test"
};

export const PROTECTED_ROUTES = {
    ADMIN: "/admin",
    CATALOG: "/library/catalog",
    TEST: "/test",

    USER: "/user",
    USER_BROWSE: "/user/browse",
}