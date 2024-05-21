export const LoginStart = (userCredentials) => ({
    type:"LOGIN_START"
})
export const LoginSuccess = (user) => ({
    type:"LOGIN_SUCCESS",
    payload:user
})
export const LoginFailure = (error) => ({
    type:"LOGIN_FAILURE",
    payload:error
})
export const Logout = () => ({
    type:"LOGOUT",
    payload:null
})
export const Wishlist = (bookId) => ({
    type:"WISHLIST",
    payload:bookId
})
export const Unwishlist = (bookId) => ({
    type:"UNWISHLIST",
    payload:bookId
})
export const Read = (bookId) => ({
    type:"READ",
    payload:bookId
})
export const UnRead = (bookId) => ({
    type:"UNREAD",
    payload:bookId
})
export const Reading = (bookId) => ({
    type:"READING",
    payload:bookId
})
export const UnReading = (bookId) => ({
    type:"UNREADING",
    payload:bookId
})