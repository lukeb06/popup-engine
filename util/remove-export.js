const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'popup-engine.js');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;

    let exportLine = false;
    let openBraces = 0;
    let closeBraces = 0;

    let newData = [];

    data.split('\n').forEach((line, i) => {
        if (line.includes('export')) exportLine = true;
        const openBraceCount = exportLine ? line.split('{').length - 1 : 0;
        const closeBraceCount = exportLine ? line.split('}').length - 1 : 0;

        openBraces += openBraceCount;
        closeBraces += closeBraceCount;

        if (!exportLine) newData.push(line);
        else if (openBraces === closeBraces) {
            exportLine = false;
        }
    });

    fs.writeFile(filePath, newData.join('\n'), err => {
        if (err) throw err;
    });
});
