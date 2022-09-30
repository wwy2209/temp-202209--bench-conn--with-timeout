// import { ALL_TASKS, fetchOptions } from '../env/constData.js'
// const { ALL_TASKS, fetchOptions } = require('../env/constData.js')
const { fetchOptions } = require('../env/constData.js')

// const libMoveFile = require('../fileDB/moveFile.js')
const libFileDB = require('../fileDB/libFileDB.js')

// https://stackoverflow.com/a/66309132
// NOTE: not-run main() =>when testing
// import path from 'path';
// import { fileURLToPath } from 'url'
// const path = require('path')
// const { fileURLToPath } = require('url')

// const nodePath = path.resolve(process.argv[1]);
// const modulePath = path.resolve(fileURLToPath(import.meta.url))
// const isRunningDirectlyViaCLI = nodePath === modulePath


// --override-URL
const GLOBAL_URL = fetchOptions['url_ALLTASKS'];
const OPTIONS = {
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-ch-ua": fetchOptions.options.headers['sec-ch-ua'],
        "sec-ch-ua-mobile": fetchOptions.options.headers['sec-ch-ua-mobile'],
        "sec-ch-ua-platform": fetchOptions.options.headers['sec-ch-ua-platform'],
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": fetchOptions.options.headers['cookie'],
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET"
};

// const GLOBAL_URL = fetchOptions.url;
// // const GLOBAL_URL = 'https://wen043.settrade.com/webrealtime/data/fastquote.jsp';
// // const GLOBAL_URL = 'https://pokeapi.co/api/v2/pokemon/1';

// const popSymbol = 'PTT';
// // const popSymbol = 'GFZ22';
// // const popSymbol = 'GFQ22';

// const OPTIONS = {
//     headers: fetchOptions.options.headers,
//     method: fetchOptions.options.method,
//     body: `symbol=${popSymbol}&key=${fetchOptions.key}`,
// }

const getOldList_fromText = function (fullText, startWithText) {
    // 
    const posStartDetect = fullText.indexOf(startWithText);
    const posStart = posStartDetect + startWithText.length - 1;
    const posEnd = fullText.indexOf(']', posStart) + 1;
    const oldListText = fullText.substring(posStart, posEnd);
    return oldListText;
}
// const getNewList_fromText =  function (fullText) {
//     // 
//     const symbolListText = 'xxx';
//     return symbolListText;
// }
const oneFetch = async function (someParams) {
    let hasErr = false;

    const res = await fetch(GLOBAL_URL, OPTIONS).catch(function (err) {
        console.error(err);
        // check-err http
        console.log('err::: --- http ---');

        return false;
    });

    let resultAllSymbols = '';

    if (res === false) {
        hasErr = true;
    } else {
        // const hasData = await res.json();
        const hasData = await res.text();
        // console.log(hasData);
        const strStart = 'allSeries = [';
        const posStartDetect = hasData.indexOf(strStart);
        if (posStartDetect) {
            const pathDir = "../env/";
            const mainFileName = "all.js";

            // 
            const posStart = posStartDetect + strStart.length - 1;
            const posEnd = hasData.indexOf(']', posStart) + 1;
            const newListText = hasData.substring(posStart, posEnd);
            // console.log('newListText: ', newListText);
            console.log('newListText.length: ', newListText.length);
            const newListJson = JSON.parse(newListText);
            console.log('newListJson.length: ', newListJson.length);
            // --check new==old
            // --uodate ALL_TASKS
            // backup-oldFile
            // await libMoveFile('./mock.txt', './mm.txt');
            // await libMoveFile('../httpClient/mock.txt', '../httpClient/mm.txt');
            // await libMoveFile('../httpClient/mm.txt', '../httpClient/mock.txt');
            // await libMoveFile('../env/all-bak202209-xx-s1.js', '../env/all-bak202209-xx-s122.js');
            // update-newFile
            // ,read-oldFile
            const oldListFullText = await libFileDB.readFileText({
                filePath: pathDir + mainFileName,
            })
            if (oldListFullText === false) {

                console.log('err::: --- readFile ---');

                hasErr = true;
                return hasErr
            }
            // console.log('oldListFullText: ',oldListFullText);
            // ,getOldListData
            const oldListText = getOldList_fromText(oldListFullText, 'ALL_TASKS = [')
            console.log('oldListText.length: ', oldListText.length);
            // resultAllSymbols = 
            // ,check-diff

            // if-diff
            if (oldListText != newListText) {
                // if (true) {
                console.log('-- update-data --');
                // ,+save
                // ,backup-oldFile
                const dateNow = new Date();
                const currentDateDay = ("0" + (dateNow.getDate())).slice(-2);
                const currentMonth = ("0" + (dateNow.getMonth() + 1)).slice(-2);
                const currentHours = ("0" + (dateNow.getHours())).slice(-2);
                const currentMinutes = ("0" + (dateNow.getMinutes())).slice(-2);
                const bakFileName = `all.bak${dateNow.getFullYear()}${currentMonth}-${currentDateDay}--${currentHours}_${currentMinutes}.js`
                console.log('backup-to: ', bakFileName);
                libFileDB.saveFileText({
                    manyText: oldListFullText,
                    filePath: pathDir + bakFileName,
                    isNewFile: true,
                })
                // ,del-oldList
                // ,insert-newList
                const newFileListText = oldListFullText.replace(oldListText, newListText);
                // ,saveFile
                libFileDB.saveFileText({
                    manyText: newFileListText,
                    filePath: pathDir + mainFileName,
                    isNewFile: true,
                })
            }
        } else {
            console.log('err::: --- permission ---');

            hasErr = true;
        }
        // console.log(hasData);
    }

    return hasErr;
}


async function main() {
    let hasErr = false;
    let lastLoop_timeMn = 66;

    const sleepTimeMs = 1000;
    while (!hasErr) {
        const currentLoop_timeMn = (new Date()).getUTCMinutes();
        if (currentLoop_timeMn == lastLoop_timeMn) {
            // DEBUG: wait
            // const current_timeSec = (new Date()).getUTCSeconds();
            // console.log('wait Mn.', current_timeSec + 's');

            // wait next(minutes)
            await new Promise(r => setTimeout(r, sleepTimeMs));
            continue;
        }
        lastLoop_timeMn = currentLoop_timeMn;

        const isErr = await
            oneFetch('some param')
                .catch(function (err) {
                    console.log('err::: -------------------');
                    console.error(err);
                });

        const timeDateTime_bangkok = (new Date()).toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
        if (isErr) {
            hasErr = true;
            console.log('err-on: ', timeDateTime_bangkok);

            break;
        }

        // DEBUG: hasRes
        console.log('hasRes-on: ', timeDateTime_bangkok);

        // await new Promise(r => setTimeout(r, sleepTimeMs));
        // continue;
    }

    console.log('Ended-main;');
}

main().catch(err => {
    console.error(err);
})
// console.log('isRunningDirectlyViaCLI: ', isRunningDirectlyViaCLI);
// if (isRunningDirectlyViaCLI) {
//     console.log('console-starting: -- ');
//     main();
//     console.log('console-ended: -- ');
// }


// export { oneFetch }