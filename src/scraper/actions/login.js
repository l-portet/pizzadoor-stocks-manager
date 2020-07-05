const axios = require('axios');
const qs = require('querystring');
const parseAtmsLinks = require('./parse-atms-links');
const getCookies = require('../utils/get-cookies');

const http = axios.create({
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  maxRedirects: 0,
  withCredentials: true,
  validateStatus(status) {
    return status >= 200 && status < 400;
  }
});

http.interceptors.response.use(
  async res => {
    if (res.status >= 300 && res.status < 400) {
      return await http({
        url: res.headers.location,
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
  },
  err => {
    return err;
  }
);

async function login(username, password) {
  const url = 'https://www.mypizzadoor.com/manager-v1/fr_FR/login/connexion/';
  const data = {
    user_login: username,
    user_password: password
  };
  const config = {
    maxRedirects: 0
  };
  const res = await http.post(url, qs.stringify(data), config);

  return {
    atms: parseAtmsLinks(res.data),
    cookies: getCookies(res.config.headers['Cookie'], res.headers['set-cookie'])
  };
}

module.exports = login;
