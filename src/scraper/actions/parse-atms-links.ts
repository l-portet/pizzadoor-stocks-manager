// @ts-nocheck
import cheerio from 'cheerio';

export default function parseAtmsLinks(html) {
  const $ = cheerio.load(html);
  const atms = [];

  $('.daplink').each((index, el) =>
    atms.push({
      name: $(el)
        .text()
        .trim(),
      link: $(el).attr('href'),
    })
  );

  return atms;
}
