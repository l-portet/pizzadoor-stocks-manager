const cheerio = require('cheerio');
const qs = require('qs');

async function getAtmsInfos(http, { url, cookies }) {
  const config = {
    headers: {
      Cookie: cookies
    }
  };
  const data = {};
  let res;

  try {
    res = await http.post(url, qs.stringify(data), config);
  } catch (e) {
    throw e;
  }
  const $ = cheerio.load(res.data);
  const atms = [];

  $('.daplink').each((index, el) =>
    atms.push({
      name: $(el)
        .text()
        .trim(),
      link: $(el).attr('href')
    })
  );

  return atms;
}

module.exports = getAtmsInfos;
