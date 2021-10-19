const fs = require('fs')
const axios = require('axios')
const path = require ('path')

async function downloadImage (url, charName) {    
    const response = await axios.get(url, { responseType: 'stream' });
    const filepath = path.resolve(__dirname, '../data/img/thumbnail/', `${charName}.png`)
    const writer = fs.createWriteStream(filepath)

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    })
}

module.exports = downloadImage;