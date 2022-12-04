//Downloads aayat files files Juz wise and page wize arranged in folders
// <juz_number>/<page_number>/<surat>_<aayat>.mp3
const request = require('request');
const fs = require('fs');
const https = require('https');
const getFile = function (surah, aayah, juz, page) {
    let urlAayah = `https://mushaf.elearningquran.com/media/shz/${surah}_${aayah}.mp3`;
    let dir = `./PageWiseQuran/${juz}/${page}`;
    let path = `${dir}/${surah}_${aayah}.mp3`
    console.log(`getting file ${path}`);
    https.get(urlAayah, (res) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on('finish', () => {
            filePath.close();
            console.log(`Download Completed => ${path}`);
            if (aayah !== 0) {
                download(surah, (aayah + 1));
            }
        })
    });
}
const download = function (surah, aayah) {
    if (surah > 114) {
        console.log('Everything downloaded');
        return;
    }
    let page = 0;
    let juz = 0;
    let url = `https://api.qurancdn.com/api/qdc/verses/filter?filters=${surah}%3A${aayah}&fields=page_number&mushaf=2`
    request(url, (err, resp, body) => {
        console.log('url', url);
        console.log('json', body);
        body = JSON.parse(body);
        console.log('verses.length', body.verses.length)
        if (body.verses.length) {
            juz = body.verses[0].juz_number;
            page = body.verses[0].page_number
            if (aayah === 1) {
                getFile(surah, 0, juz, page);
            }
            getFile(surah, aayah, juz, page);
        } else {
            console.log(`new surah::${surah}|aayah:${aayah}`);
            aayah = 1;
            surah++;
            download(surah, aayah);
        }
    });
    
}
download(4, 77);