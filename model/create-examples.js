const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const { shuffle } = require('./helpers');

const DEFAULT_AMOUNT = 15;
const amount = Number(process.argv[2] || DEFAULT_AMOUNT);

if (amount < 1)
    throw new Error("Örnek sayısı 1 veya 1'den büyük olmalıdır.");

let examples = [];

fs.createReadStream(path.resolve(__dirname, 'mobile-phone-prices-examples.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        let example = { id: Number(row["id"]) };
        delete row["id"];

        let features = Object.keys(row).map(k => [k, Number(row[k])]);
        example.features = Object.fromEntries(features);

        examples.push(example);
    })
    .on('end', () => {
        const part = shuffle(examples).slice(0, amount);

        fs.writeFileSync(
            path.resolve(__dirname, "examples.json"),
            JSON.stringify(part)
        );
    })