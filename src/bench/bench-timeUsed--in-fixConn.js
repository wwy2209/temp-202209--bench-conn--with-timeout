
// https://stackoverflow.com/a/66309132
// import path from 'path';
// import { fileURLToPath } from 'url'
// const path = require('path')
// const { fileURLToPath } = require('url')

// import got from 'got';
// import fetch from 'node-fetch';

// import fetchOptions from "../env/fetchOptions.js"
const fetchOptions = require("../env/fetchOptions.js")

// const nodePath = path.resolve(process.argv[1]);
// const modulePath = path.resolve(fileURLToPath(import.meta.url))
// const isRunningDirectlyViaCLI = nodePath === modulePath

const GLOBAL_URL = fetchOptions.url;
// const GLOBAL_URL = 'https://wen043.settrade.com/webrealtime/data/fastquote.jsp';
// const GLOBAL_URL = 'https://pokeapi.co/api/v2/pokemon/1';

const popSymbol = 'PTT';
const OPTIONS = {
    headers: fetchOptions.options.headers,
    method: fetchOptions.options.method,
    body: `symbol=${popSymbol}&key=${fetchOptions.key}`,
}

const oneFetch = async function (someParams) {
    let hasErr = false;
    for (let i = 0; i < 2; i++) {
        // for (let i = 0; i < 12; i++) {
        // try {
        //     const res = await got(GLOBAL_URL, { "method": "GET" });
        //     if (res.ok) {
        //         const body = res.body;
        //     } else {
        //         hasErr = true;
        //     }
        // } catch (error) {
        //     // console.error(error)
        //     console.log('--catch--')

        //     hasErr = true;
        // }

        const timeFetchStart = Date.now()

        const timeUseController = new AbortController;
        const timeoutID = setTimeout(()=>timeUseController.abort(), 200)
        OPTIONS.signal = timeUseController.signal;

        // const res = await fetch(GLOBAL_URL)
        const res = await fetch(GLOBAL_URL, OPTIONS)
            .catch(function (err) {
                // console.error(err);
                // console.log(err.name == 'AbortError');
                if (err.name == 'AbortError') {
                    return 'AbortError';
                }
                hasErr = true;

                return false;
            });

        if (res === false) {
            hasErr = true;
        } else if(res == 'AbortError'){
            const timeFetchAbortErrorUsed = Date.now() - timeFetchStart
            console.log('timeFetchAbortErrorUsed: ', timeFetchAbortErrorUsed);
        } else {
            const hasData = await res.text();
            // const hasData = await res.body();
            // console.log(hasData);

            const timeFetchUsed = Date.now() - timeFetchStart
            console.log('timeFetchUsed: ', timeFetchUsed);
        }

    }

    return hasErr;
}


async function main() {
    // run-concurrent(paralet http-client)
    const cons = []
    let numConn = 5;
    let hasErr = false;

    const timeBenchLimit = 700; //ms
    // const timeBenchLimit = 2 * 1000; //ms

    let loop_i = 1;
    while (!hasErr) {
        console.log('numConn: ', numConn);
        console.time('allConn');
        for (let i = 0; i < numConn; i++) {
            cons.push(
                oneFetch('some param')
            )
        }
        // --time-start
        const timeStart = Date.now();
        const results = await Promise.all(cons)
            .catch(function (err) {
                console.log('err::: -------------------');
                console.error(err);
            });

        // console.log('results: ', results);
        // check-err http
        for (let i = 0; i < results.length; i++) {
            const resultErr = results[i];
            const local_hasErr = resultErr;
            if (local_hasErr) {
                hasErr = true;
                console.log(`err-on: -- [numConn=${numConn}, i=${i}] -- `);
                break;
            }
        }

        // --time-stop
        const timeStop = Date.now();
        const timeUsed = timeStop - timeStart;
        // check-err long-time
        if (timeUsed > timeBenchLimit) {
            hasErr = true;
            console.log('err::: outOfTime - timeUsed: ', timeUsed);
            console.log(`err-on: -- [numConn=${numConn}, i=${loop_i}] -- `);
            break;
        }

        console.log(`log-at: -- [numConn=${numConn}, i=${loop_i}] -- `);
        console.log('timeUsed: ', timeUsed);

        const sleepTimeMs = 10;
        await new Promise(r => setTimeout(r, sleepTimeMs));

        console.timeEnd('allConn');

        // double(x + 0.5)--numConn
        numConn = numConn + ((numConn / 2) | 0)
        loop_i++;
    }
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