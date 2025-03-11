import loadable from "@loadable/component";

export const fetchAllBooks = loadable.lib(() => import("./getAllBooks"))

export const fetchAllNewlyAcquiredBooks = loadable.lib(() => import("./getAllNewlyAcquiredBooks"))