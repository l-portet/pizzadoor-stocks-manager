export function getCookies(
  configCookies: string[] | string = [],
  setCookies: string[] | string = []
): string {
  if (Array.isArray(configCookies)) {
    configCookies = configCookies.join('; ');
  }
  if (Array.isArray(setCookies)) {
    setCookies = setCookies.join('; ');
  }

  let configCookiesArr = configCookies.split(';').map(cookie => cookie.trim());
  let setCookiesArr = setCookies.split(';').map(cookie => cookie.trim());

  // Remove config cookies already in set-cookies
  configCookiesArr = configCookiesArr.filter(
    configCookie =>
      !setCookiesArr.find(setCookie =>
        setCookie
          .toLowerCase()
          .startsWith(configCookie.split('=')[0].toLowerCase())
      )
  );

  return [...configCookiesArr, ...setCookiesArr].join('; ');
}
