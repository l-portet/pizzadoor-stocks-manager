const axios = require('axios');
const qs = require('querystring');
const getCookies = require('../utils/get-cookies');

const CancelToken = axios.CancelToken;

const http = axios.create({
  timeout: 15000,
  maxRedirects: 0,
  headers: {
    connection: 'keep-alive',
    'X-Requested-With': 'XMLHttpRequest'
  },
  validateStatus(status) {
    return status >= 200 && status < 400;
  }
});

http.interceptors.response.use(async res => {
  if (res.status >= 300 && res.status < 400) {
    let redirectURL;

    if (!res.headers.location) {
      return res;
    }

    if (res.headers.location.startsWith('/')) {
      redirectURL = res.config.url.split('/?')[0] + res.headers.location;
    } else {
      redirectURL = res.headers.location;
    }

    return await http({
      url: redirectURL, // res.headers.location,
      method: res.config.method,
      headers: {
        Cookie: getCookies(
          res.config.headers['Cookie'],
          res.headers['set-cookie']
        )
      }
    });
  }
  return res;
});

async function extractAtmInfos(url, cookies) {
  const source = CancelToken.source();
  let res;
  const config = {
    cancelToken: source.token,
    headers: {
      Cookie: cookies
    }
  };

  try {
    setTimeout(source.cancel, 15000);
    res = await http.get(url, config);

    return {
      baseURL: res.config.url.split('/admin')[0],
      cookies: res.config.headers.Cookie
    };
  } catch (e) {
    return {
      baseURL: '',
      cookies: ''
    };
  }
}

module.exports = extractAtmInfos;
