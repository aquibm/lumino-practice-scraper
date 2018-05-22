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
    const practices = []

    $('.practice-list > .row-fluid')
        .children()
        .each((idx, item) => {
            const $p = cheerio.load(item)

            const practiceName = $p('.media-heading a')
                .text()
                .trim()
                .replace(' »', '')

            const fullAddress = $p('.address')
                .text()
                .trim()

            const phoneNumber = $p('.contact a')
                .text()
                .trim()

            practices.push({
                practiceId: uuid(),
                practiceName,
                address: {
                    streetAddress: fullAddress,
                    suburb: '',
                    city: '',
                    postcode: '',
                },
                phoneNumber,
                emailAddress: '',
            })
        })

    return practices
}

exports.scrape = html => {
    if (!html) throw Error('no html')

    const $ = cheerio.load(html)

    const region = scrapeRegion($)
    const practices = scrapePractices($)
    const latLongs = scrapeLatLongs($)

    practices.forEach(practice => {
        practice.address.latitude = latLongs[practice.practiceName].latitude
        practice.address.longitude = latLongs[practice.practiceName].longitude
        practice.region = region
    })

    return practices
}
