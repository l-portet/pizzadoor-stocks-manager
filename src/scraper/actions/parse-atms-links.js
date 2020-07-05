const cheerio = require('cheerio');

function parseAtmsLinks(html) {
  const $ = cheerio.load(html);
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

module.exports = parseAtmsLinks;
