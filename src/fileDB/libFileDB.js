// import { join, dirname } from 'path'
// import { fileURLToPath } from 'url'

const path = require("path");



const fsFull = require("fs");
// import fs from 'fs/promises';

const fs = fsFull.promises;

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const __dirname = process.cwd();


async function readFileText({ filePath }) {
    // console.log(isNewFile);
    // ------------------------------------
    // --path
    // const file = path.join(__dirname + '/db/', `db--${filename_id}.json`)
    const file = path.join(__dirname, filePath)
    // const file = path.join(folder_path, `db--${filename_id}.json`)
    // --read-file
    try {
        const data = await fs.readFile(file, 'utf8')
        return data;
    }
    catch (err) {
        console.log(err)
        return false;
    }

    // return 'bug';
    return false;
}

// async function saveJson({ manyText, filename_id, path_subDir = null, isNewFile = false }) {
async function saveFileText({ manyText, filePath, isNewFile = false }) {
    // ------------------------------------
    // --path
    // const file = path.join(__dirname + '/db/', `db--${filename_id}.json`)
    // const file = path.join(__dirname + '/db/', path_subDir, `db--${filename_id}.json`)
    // const dirPath = path.join(__dirname, filePath)
    const filePathFull = path.join(__dirname, filePath);
    // ------------------------------------
    // create-a-directory-if-it-doesnt-exist
    // https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
    // if (!fsFull.existsSync(path.dirname(filePathFull))) {
    //     fsFull.mkdirSync(dirPath, { recursive: true });
    // }
    // ------------------------------------
    // console.log(isNewFile);
    if (isNewFile) {
        await fs.truncate(filePathFull).catch(err => true);
    }
    // ------------------------------------
    // --append-data
    await fs.appendFile(filePathFull, manyText).catch(function (err) {
        console.error(err);
    });

    return true;
}

module.exports = { saveFileText, readFileText };

