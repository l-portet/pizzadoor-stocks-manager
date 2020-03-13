async function login(username, password) {
  await page.focus('#user_login')
  await page.keyboard.type(username);
  await page.focus('#user_password')
  await page.keyboard.type(password);

  await page.$eval('#user_connect', el => el.click());
}

module.exports = login;
