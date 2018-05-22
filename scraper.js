const cheerio = require('cheerio')
const uuid = require('uuid').v4

exports.scrape = html => {
    if (!html) throw Error('no html')

    const $ = cheerio.load(html)

    return [
        {
            practiceId: uuid(),
            practiceName: 'wololo',
        },
    ]
}
