async function getDirectUrl(rawUrl) {
  await page.goto(rawUrl);

  return page.url();
}

module.exports = getDirectUrl;
