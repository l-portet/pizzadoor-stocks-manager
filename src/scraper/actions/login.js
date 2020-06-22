const qs = require('qs');

async function login(http, username, password) {
  const url = 'https://www.mypizzadoor.com/manager-v1/fr_FR/login/connexion/';
  const data = {
    user_login: username,
    user_password: password
  };
  const config = {
    withCredentials: true,
    maxRedirects: 0
  };
  let res;
  let dashboardCookies;

  try {
    res = await http.post(url, qs.stringify(data), config);
  } catch (e) {
    // Avoid 302 to be interpreted as errors
    res = e.response;
  }
  dashboardCookies = res.headers['set-cookie'];
  dashboardCookies = dashboardCookies.join(';').split(';');
  dashboardCookies = `${dashboardCookies.find(s =>
    s.startsWith('SERVERID')
  )}; ${dashboardCookies.find(s => s.startsWith('PHPSESSID'))};`;

  return { url: res.headers.location, cookies: dashboardCookies };
}

module.exports = login;
