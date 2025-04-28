import loadable from "@loadable/component";

// FOOTER
export const Footer = loadable(() => import("./Footer/Footer"))
export const Copyright = loadable(() => import("./Footer/Copyright"))


// HEADER
export const Header = loadable(() => import("./Header/Header"))
export const HeaderButtons = loadable(() => import("./Header/HeaderButtons"))

// LIBRARY CARD
export const ECard = loadable(() => import("./LibraryCard"))

// LINE
export const PageTitle = loadable(() => import("./PageTitle"))

// VERIFICATION
export const Login = loadable(() => import("./Modal/Login/Login"))
export const ConfirmOTP = loadable(() => import("./Modal/Verification/confirmOTP"))
export const SendOTP = loadable(() => import("./Modal/Verification/sendOTP"))
export const Identification = loadable(() => import("./Modal/Identification"))
export const AccessionNumber = loadable(() => import("./Modal/AccessionNumber"))
export const ModalForm = loadable(() => import("./Modal/ModalForm"))

// TABLE AND BUTTON
export const DynamicTable = loadable(() => import("./Table"))
export const DynamicTableCell = loadable(() => import("./Table/ActionCell"))
export const Dialog = loadable(() => import("./Dialog"))
export const UploadButton = loadable(() => import("./UploadButton"))
export const Dropdown = loadable(() => import("./SelectMenu"))
export const DropdownSwitch = loadable(() => import("./SelectMenu/Switch") as Promise<{ default: React.ComponentType<any> }>);

// BROWSE PAGE SECTION
export const FeaturedBookSection = loadable(() => import("./Sections/FeaturedBooks"))
export const NewlyAcquiredBookSection = loadable(() => import("./Sections/NewlyAcquiredBooks"))
export const BrowseBookSection = loadable(() => import("./Sections/BrowseBooks"))
export const AccountOverviewSection = loadable(() => import("./Sections/AccountOverview"))

// BOOK FORM
export const FirstPage = loadable(() => import("./Book/BookForm/FirstPage"))
export const SecondPage = loadable(() => import("./Book/BookForm/SecondPage"))

// BOOK DETAILS
export const BookDetails = loadable(() => import("./Book/BookDetails"))

export const Loading = loadable(() => import("./LoadingSpinner"))
export const CustomDialog = loadable(() => import("./Dialog"))
export const IosSwitch = loadable(() => import("./IOSSwitch"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))
// export const = loadable(() => import("./"))