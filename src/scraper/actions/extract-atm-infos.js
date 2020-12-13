const axios = require('axios');
const qs = require('querystring');
const getCookies = require('../utils/get-cookies');

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const http = axios.create({
  cancelToken: source.token,
  timeout: 5000,
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

    setTimeout(source.cancel, 5000);

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
  let res;
  const config = {
    headers: {
      Cookie: cookies
    }
  };

  try {
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
