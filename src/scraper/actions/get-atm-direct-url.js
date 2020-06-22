async function getAtmDirectUrl(http, proxyUrl, cookies) {
    const config = {
      maxRedirects: 0,
      headers: {
        Cookie: cookies
      }
    };
    let res;

    try {
      res = await http.get(proxyUrl, config);
    } catch (e) {
      res = e.response;
    }

    return {
      url: res.headers.location,
      baseUrl: res.headers.location.split('/?')[0]
    };
  }

module.exports = getAtmDirectUrl;
