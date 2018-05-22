const express = require('express'),
    request = require('request'),
    scraper = require('./scraper')

const port = process.env.NOW ? 80 : 8000
const app = express()

app.get('/', (req, res) => res.send('OK'))

app.get('/s/:island/:region', (req, res) => {
    const url = `https://lumino.co.nz/location/${req.params.island}/${
        req.params.region
    }`

    request(url, (err, response, html) => {
        if (err) return res.send(500, err)

        try {
            const practices = scraper.scrape(html)
            res.json(practices)
        } catch (parseError) {
            res.send(500, parseError.message)
        }
    })
})

app.listen(port, console.log(`Listening on port ${port}`))
