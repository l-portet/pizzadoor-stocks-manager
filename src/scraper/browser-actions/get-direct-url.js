async function getDirectUrl(rawUrl) {
  const { page } = _shared;

  await page.goto(rawUrl);

  return page.url();
}

module.exports = getDirectUrl;
