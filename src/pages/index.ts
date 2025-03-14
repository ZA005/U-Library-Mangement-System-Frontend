import loadable from "@loadable/component";
import LoadingSpinner from "../components/LoadingSpinner";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const HomeScreen = loadable(() => import("./HomeScreen"), {
    fallback: LoadingSpinner(),
});
export const PageNotFound = loadable(() => import("./PageNotFound"), {
    fallback: LoadingSpinner(),
});
export const ActivateUser = loadable(() => import("./AccountActivation/ActivateUser"), {
    fallback: LoadingSpinner(),
});
export const AccountLibraryCard = loadable(() => import("./AccountActivation/AccountLibraryCard"), {
    fallback: LoadingSpinner(),
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






export const AccessionRecord = loadable(() => import("./Acquisition/AccessionRecord"), {
    fallback: LoadingSpinner(),
});
export const Browse = loadable(() => import("./Browse"), {
    fallback: LoadingSpinner(),
});
export const Catalog = loadable(() => import("./Catalog/Form"), {
    fallback: LoadingSpinner(),
});
export const NewlyAcquiredBooks = loadable(() => import("./Browse/NewlyAcquiredBook"), {
    fallback: LoadingSpinner(),
})
export const BrowseAllBooks = loadable(() => import("./Browse/BrowseBooks"), {
    fallback: LoadingSpinner(),
})
export const BookInformation = loadable(() => import("./Catalog/Information"), {
    fallback: LoadingSpinner(),
})




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const UploadManager = loadable(() => import("./Curriculum/UploadManager"), {
    fallback: LoadingSpinner(),
});

export const UploadDepartment = loadable(() => import("./Curriculum/Uploader/Department"), {
    fallback: LoadingSpinner(),
});
export const UploadProgram = loadable(() => import("./Curriculum/Uploader/Program"), {
    fallback: LoadingSpinner(),
});
export const UploadCurriculum = loadable(() => import("./Curriculum/Uploader/Curriculum"), {
    fallback: LoadingSpinner(),
});
export const UploadCourse = loadable(() => import("./Curriculum/Uploader/Course"), {
    fallback: LoadingSpinner(),
});

// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))