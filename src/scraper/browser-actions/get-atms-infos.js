
async function getAtmInfos() {
  const { page } = _shared;

  let { names, links } = await page.$$eval(
    'a.list-group-item.daplink',
    links => {
      let names = links.map(link => link.innerText);
      links = links.map(link => link.href);
      return { names, links };
    }
  );
  let infos = [];

  for (let i = 0; i < names.length; i++) {
    infos.push({ name: names[i], link: links[i] });
  }

  return infos;
}

module.exports = getAtmInfos;
