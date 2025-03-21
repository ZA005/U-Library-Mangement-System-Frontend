import loadable from "@loadable/component";

export const fetchAllBooks = loadable.lib(() => import("./getAllBooks"))
export const fetchNewlyAcquired = loadable.lib(() => import("./getNewlyAcquired"))

export const fetchLibraryLocations = loadable.lib(() => import("./Location/getAllLibraryLocations"))
export const updateLibraryLocation = loadable.lib(() => import("./Location/updateLibraryLocation"))
export const addLibraryLocation = loadable.lib(() => import("./Location/addLibraryLocation"))
export const getBaseAccessionNumber = loadable.lib(() => import("./getBaseAccessionNumber"))

export const fetchLibrarySections = loadable.lib(() => import("./Section/getAllLibrarySections"))
export const updateLibrarySection = loadable.lib(() => import("./Section/updateLibrarySection"))
export const addLibrarySection = loadable.lib(() => import("./Section/addLibrarySection"))