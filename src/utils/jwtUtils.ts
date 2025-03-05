const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeJwt(token);
    const exp = decodedToken.exp * 1000; // exp is in seconds, convert to milliseconds
    const currentTime = new Date().getTime();
    return currentTime >= exp;
};
