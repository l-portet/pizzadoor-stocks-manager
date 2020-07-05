function getCookies(configCookies = [], setCookies = []) {
  if (Array.isArray(configCookies)) {
    configCookies = configCookies.join('; ');
  }
  if (Array.isArray(setCookies)) {
    setCookies = setCookies.join('; ');
  }

  configCookies = configCookies.split(';').map(cookie => cookie.trim());
  setCookies = setCookies.split(';').map(cookie => cookie.trim());

  // Remove config cookies already in set-cookies
  configCookies = configCookies.filter(
    configCookie =>
      !setCookies.find(setCookie =>
        setCookie
          .toLowerCase()
          .startsWith(configCookie.split('=')[0].toLowerCase())
      )
  );

  return [...configCookies, ...setCookies].join('; ');
}

module.exports = getCookies;
