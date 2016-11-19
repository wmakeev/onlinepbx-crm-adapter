const osmosis = require('osmosis')

const centralSelector = require('./selectors/central')
const sfoSelector = require('./selectors/sfo')
const yfoSelector = require('./selectors/yfo')

const getSearchUrl = (host, num) => `http://${host}/search?number=${encodeURIComponent(num)}`
const getScraper = selector => host => phone => selector(osmosis.get(getSearchUrl(host, phone)))

const getCentralScraper = getScraper(centralSelector)
const getSfoScraper = getScraper(sfoSelector)
const getYfoScraper = getScraper(yfoSelector)

module.exports = {
  'Центральный федеральный округ': getCentralScraper('infophon.ru'),
  'Дальневосточный федеральный округ': getCentralScraper('dfophones.ru'),
  'Приволжский федеральный округ': getCentralScraper('pfophones.ru'),
  'Сибирский федеральный округ': getSfoScraper('sfophones.ru'),
  'Уральский федеральный округ': getYfoScraper('yfophones.ru'),
  'Южный федеральный округ': getCentralScraper('ufophones.ru'),
  'Северо-Западный федеральный округ': getCentralScraper('szfophones.ru'),
  'Северо-Кавказский федеральный округ': getCentralScraper('skfophones.ru')
}

