import test from 'ava'
import { readFile } from 'fs'

import { scrape } from './scraper'

test('it should be able to scrape', async t => {
    const practices = await scrapeLocal('./samples/northland.html')
    t.is(practices.length, 7)
})

const scrapeLocal = file => {
    return new Promise((resolve, reject) => {
        readFile(file, 'utf-8', (err, data) => {
            if (err) return reject(err)
            resolve(scrape(data))
        })
    })
}
