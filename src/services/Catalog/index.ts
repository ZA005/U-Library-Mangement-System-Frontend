import loadable from "@loadable/component";

export const fetchAllBooks = loadable.lib(() => import("./getAllBooks"))
export const fetchNewlyAcquired = loadable.lib(() => import("./getNewlyAcquired"))
export const fetchLibraryLocations = loadable.lib(() => import("./Location/getAllLibraryLocations"))
export const updateLibraryLocation = loadable.lib(() => import("./Location/updateLibraryLocation"))