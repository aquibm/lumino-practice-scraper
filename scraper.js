const cheerio = require('cheerio')
const uuid = require('uuid').v4

const scrapeRegion = $ => {
    const title = $('title')
        .text()
        .trim()

    const regionName = title.match(
        /Dental Practices In (.*) - Lumino The Dentists/,
    )[1]

    return {
        regionId: uuid(),
        regionName,
    }
}

const scrapeLatLongs = $ => {}

const scrapePractices = $ => {}

exports.scrape = html => {
    if (!html) throw Error('no html')

    const $ = cheerio.load(html)

    const region = scrapeRegion($)
    const practices = scrapePractices($)
    const latLongs = scrapeLatLongs($)

    return [
        {
            practiceId: uuid(),
            practiceName: 'wololo',
            address: {
                streetAddress: '85 Albert Street',
                suburb: 'Auckland Central',
                city: 'Auckland',
                postcode: '1010',
                latitude: -36.84786,
                longitude: 174.76353,
            },
            region,
            phoneNumber: '+64 9-373 4962',
            emailAddress: 'proudmouth@lumino.co.nz',
        },
    ]
}
