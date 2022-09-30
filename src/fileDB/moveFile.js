const fsFull = require('fs');
const path = require("path");
// const mkdirp = require("mkdirp");

// const shell = require("shelljs");

const fs = fsFull.promises;

// ref:
// https://stackoverflow.com/a/29105404
module.exports = async function move(oldPath, newPath) {
    // // async function copy() {
    // //     var readStream = fsFull.createReadStream(oldPath);
    // //     var writeStream = fsFull.createWriteStream(newPath);

    // //     readStream.on('error', callback);
    // //     writeStream.on('error', callback);

    // //     readStream.on('close', function () {
    // //         fs.unlink(oldPath, callback);
    // //     });

    // //     readStream.pipe(writeStream);
    // // }

    // // const copy = (from, to) => {
    // //     return new Promise((resolve) => {
    // //         shell.cp("-R", from + "/*", to);
    // //         resolve();
    // //     });
    // // }
    // // const rm = (path) => {
    // //     return new Promise((resolve) => {
    // //         shell.rm("-R", path);
    // //         resolve();
    // //     });
    // // }

    // https://stackoverflow.com/questions/52062480/fs-rename-enoent-no-such-file-or-directory
    // const oldPathFull = path.join(__dirname, "..", "documents", "bka", oldPath);
    const oldPathFull = path.join(__dirname, oldPath);
    const newPathFull = path.join(__dirname, newPath);
    // let oldArr = oldPathFull.split("/");
    // let newArr = newPathFull.split("/");
    // let np = "";
    // let op = "";

    // const createDir = (path) => {
    //     return new Promise((resolve) => {
    //         mkdirp(path, (err) => {
    //             if (err) throw err
    //             resolve(path)
    //         });
    //     });
    // }

    // var results = []
    // for (var i = 0; i < oldArr.length; i++) {
    //     op += oldArr[i] + "/";
    //     np += newArr[i] + "/";
    //     if (oldArr[i] != newArr[i]) {
    //         Promise.resolve()
    //         var result = {}
    //         result.from = op;
    //         result.to = np;
    //         results.push(result);
    //     }
    // }

    // createDir(results[results.length - 1].to)
    //     .then(() => {
    //         copy(results[results.length - 1].from, results[results.length - 1].to)
    //         .then(() => {
    //             rm(results[0].from).then(() => {
    //                 results.pop();
    //             });
    //         });
    //     });

    // ----------
    console.log(`moving-file: from(${oldPathFull}), to(${newPathFull})`);
    // const notErr = await fs.rename(oldPath, newPath).catch(function (err) {
    const notErr = await fs.rename(oldPathFull, newPathFull).catch(function (err) {
        if (err.code === 'EXDEV') {
            // copy();
            console.log('err::: can copy()');
        } else {
            console.log(err);
        }
        return false;
        // callback();
    });
    if (notErr === false) {
        // err
    }
}