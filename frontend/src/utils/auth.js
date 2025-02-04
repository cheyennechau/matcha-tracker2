// Store access and refresh tokens in local storage
export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

// Get access token from local storage
export const getAccessToken = () => localStorage.getItem('accessToken');

// Get refresh token from local storage
export const getRefreshToken = () => localStorage.getItem('refreshToken');

// Clear stored tokens in local storage
export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};