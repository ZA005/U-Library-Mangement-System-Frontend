import loadable from "@loadable/component";

export const fetchAllBooks = loadable.lib(() => import("./getAllBooks"))
export const fetchNewlyAcquired = loadable.lib(() => import("./getNewlyAcquired"))