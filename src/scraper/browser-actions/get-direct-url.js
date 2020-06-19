async function getDirectUrl(page, rawUrl) {
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
