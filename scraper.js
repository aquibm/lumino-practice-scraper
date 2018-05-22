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

const scrapeLatLongs = $ => {
    const mapInfo = $(
        'div#p_lt_ctl08_wpPlaceholder_p_lt_ctl02_Lumino_PracticeSearchResultWidget_pnlGoogleMaps',
    )
        .html()
        .trim()

    const regex = /addGoogleMarker\(p_lt_ctl08_wpPlaceholder_p_lt_ctl02_Lumino_PracticeSearchResultWidget_map, (-?\d*.\d*), (-?\d*.\d*), '(.*?)'/gm

    const latLongs = {}

    while ((m = regex.exec(mapInfo)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }

        // The result can be accessed through the `m`-variable.
        latLongs[m[3]] = {
            latitude: parseFloat(m[1]),
            longitude: parseFloat(m[2]),
        }
    }

    return latLongs
}

const scrapePractices = $ => {
    return 'kek'
}

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
        {
            name: 'debug',
            latLongs,
            practices,
        },
    ]
}
