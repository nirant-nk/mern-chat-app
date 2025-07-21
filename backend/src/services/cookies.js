const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
}

export const attachCookies = (res, accessToken, refreshToken) => {
    // Access Token Cookie
    res.cookie('accessToken', accessToken, {...cookieOptions,maxAge: cookieOptions.maxAge});

    // Refresh Token Cookie
    res.cookie('refreshToken', refreshToken, {...cookieOptions,maxAge: cookieOptions.maxAge * 7});
};

export const removeCookies = (res) => {
    // remove access token
    res.clearCookie('accessToken', {...cookieOptions,maxAge: 0});

    // remove refresh token
    res.clearCookie('refreshToken', {...cookieOptions,maxAge: 0});
}