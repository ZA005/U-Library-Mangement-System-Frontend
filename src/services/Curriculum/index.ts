import loadable from "@loadable/component";

// DEPARTMENT
export const fetchAllDepartments = loadable.lib(() => import("./Department/getAllDepartment"))
export const fetchAllDepartmentById = loadable.lib(() => import("./Department/getDepartmentById"))

// PROGRAM
export const fetchAllPrograms = loadable.lib(() => import("./Program/getAllPrograms"))
export const fetchAllProgramsByDepartment = loadable.lib(() => import("./Program/getAllProgramsByDepartment"))

// CURRICULUM
export const fetchAllCurriculums = loadable.lib(() => import("./getAllCurriculum"))
export const fetchAllCurriculumsByProgram = loadable.lib(() => import("./getAllCurriculumsByProgram"))

// COURSES
export const fetchAllCourses = loadable.lib(() => import("./Course/getAllCourses"))
export const fetchAllCoursesByProgram = loadable.lib(() => import("./Course/getAllCoursesByProgram"))
export const fetchAllCoursesByRevision = loadable.lib(() => import("./Course/getAllCourseByRevision"))

// BOOK REFERENCING
// export const fetchAllDepartments = loadable.lib(() => import("./Department/getAllDepartment"))
// export const fetchAllDepartments = loadable.lib(() => import("./Department/getAllDepartment"))

// UPLOADER
export const uploadDepartments = loadable.lib(() => import("./UploadManager/uploadDepartment"))
export const uploadPrograms = loadable.lib(() => import("./UploadManager/uploadProgram"))
export const uploadCurriculums = loadable.lib(() => import("./UploadManager/uploadCurriculum"))
export const uploadCourses = loadable.lib(() => import("./UploadManager/uploadCourse"))