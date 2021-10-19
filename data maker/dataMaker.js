const axios = require("axios")
const cheerio = require('cheerio')
const path = require('path')
const { promises } = require('fs')

const sleep = require("./sleep.js")
const capitalize = require("./capitalize.js")
const toKoreanCommand = require("./toKoreanCommand.js")
const downloadImage = require('./downloadImage.js')
const toKoreanHitLevel = require("./toKoreanHitLevel.js")

const makeData = async () => {
    const html = await axios.get('http://rbnorway.org/T7-frame-data/')
    const charDataList = []
    const charList = []
    const imgList = []
    const $ = cheerio.load(html.data);
    const $bodyList = $("div #post-1378 div.char-grid").children("div.image-block");

    await $bodyList.each(async (i, elem) => {
        charCode = $(elem).find('p.char-title > a').attr('href')
        charList.push(charCode);
        imgList[charCode] = $(elem).find('p.img-p > a > img').attr('src')
    })
    for (const charCode of charList){
        console.log('https://rbnorway.org/' + charCode);

        const moveList = []
        const charName = charCode.split('-').slice(0, -2).join(' ')
        const charHtml = await axios.get('https://rbnorway.org/' + charCode);
        const $char = cheerio.load(charHtml.data);
        const $charBody = $char("table tbody").children('tr')
        $charBody.each((i, elem) => {
            moveList.push({
                command: toKoreanCommand($char(elem).find("td:nth-child(1)").text()),
                hitLevel: toKoreanHitLevel($char(elem).find('td:nth-child(2)').text()),
                damage: $char(elem).find('td:nth-child(3)').text(),
                startUp: $char(elem).find('td:nth-child(4)').text(),
                blockFrame: $char(elem).find('td:nth-child(5)').text(),
                hitFrame: $char(elem).find('td:nth-child(6)').text(),
                counterFrame: $char(elem).find('td:nth-child(7)').text(),
                notes: $char(elem).find('td:nth-child(8)').text()
            })
        })

        downloadImage(imgList[charCode], charName)

        charDataList.push({
            character: charName,
            imgSrc: path.resolve(__dirname, `../data/img/thumbnail/${charName.split(' ').join('-')}.png`),
            moveList: moveList
        })
        sleep(10000)
    }

    await promises.writeFile(path.resolve(__dirname, `../data/movedata.json`), 
        JSON.stringify(charDataList))

    return;
}

makeData()