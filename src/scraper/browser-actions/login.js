async function login(page, username, password) {

  await page.focus('#user_login');
  await page.keyboard.type(username);
  await page.focus('#user_password');
  await page.keyboard.type(password);

  await page.$eval('#user_connect', el => el.click());
  await page.waitForSelector('.text-info');
}

module.exports = login;
