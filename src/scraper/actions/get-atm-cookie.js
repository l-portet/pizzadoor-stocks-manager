async function getAtmCookie(http, url, dashboardCookies) {
  const config = {
    maxRedirects: 0,
    headers: {
      Cookie: dashboardCookies
    }
  };
  let res;
  let baseUrl = null;

  try {
    res = await http.get(url, config);
  } catch (e) {
    if (typeof e.response === 'undefined') {
      return {
        cookies: null,
        baseUrl
      };
    }
    res = e.response;
  }


  let cookies = res.headers['set-cookie'];
  // Handle new token behavior distribution
  if (res.config.url.includes('sav.adial-france.com')) {
    ({ cookies, baseUrl } = await getCookieFromAltSource(
      http,
      res.headers['location'],
      dashboardCookies
    ));
  }

  cookies =
    cookies
      .join(';')
      .split(';')
      .find(str => str.startsWith('AdialHTTPCookie')) + ';';

  return {
    cookies,
    baseUrl
  };
}

async function getCookieFromAltSource(http, url, cookies) {
  let res;
  const data = {};
  const config = {
    maxRedirects: 0,
    // withCredentials: true,
    headers: {
      Cookie: cookies
    }
  };

  try {
    res = await http.get(url, config);
  } catch (e) {
    res = e.response;
  }

  return {
    cookies: res.headers['set-cookie'],
    baseUrl: res.config.url.split('/?')[0]
  };
}

module.exports = getAtmCookie;
