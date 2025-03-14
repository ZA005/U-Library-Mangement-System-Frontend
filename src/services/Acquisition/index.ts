import loadable from "@loadable/component";

export const uploadRecords = loadable.lib(() => import("./addRecords"))
export const updateStatus = loadable.lib(() => import("./updateStatus"))
