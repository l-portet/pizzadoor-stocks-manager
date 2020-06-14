async function getDirectUrl(rawUrl) {
  const { page } = _shared;
  let url;

  try {
    await page.goto(rawUrl);

    url = page.url();
  } catch (e) {
    url = null;
  }
  return url;
}

module.exports = getDirectUrl;
