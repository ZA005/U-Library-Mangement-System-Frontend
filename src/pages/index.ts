import loadable from "@loadable/component"

export const HomeScreen = loadable(() => import("./HomeScreen"));
export const PageNotFound = loadable(() => import("./PageNotFound"))
export const ActivateUser = loadable(() => import("./AccountActivation/ActivateUser"))
export const AccountLibraryCard = loadable(() => import("./AccountActivation/AccountLibraryCard"))



export const AccessionRecord = loadable(() => import("./Acquisition/AccessionRecord"))
export const TestingPage = loadable(() => import("./TestPage"))
export const Catalog = loadable(() => import("./Catalog"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))