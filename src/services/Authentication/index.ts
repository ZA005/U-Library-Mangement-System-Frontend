import loadable from "@loadable/component";

// export { default as login } from './login'
export const login = loadable.lib(() => import("./login"))
// export { default as register } from './register'
export const register = loadable.lib(() => import("./register"))
export const sendOTP = loadable.lib(() => import("./sendOTP"));
// export { default as confirmOTP } from './confirmOTP'
export const confirmOTP = loadable.lib(() => import("./confirmOTP"))
// export { default as isActivated } from './isActivated'
export const isActivated = loadable.lib(() => import("./isActivated"))