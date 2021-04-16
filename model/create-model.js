const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mathjs = require('mathjs');

const { Matrix } = require('ml-matrix');
const KNN = require("ml-knn");
const ConfusionMatrix = require('ml-confusion-matrix');

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

var X = new Matrix(0, 20);
var y = new Matrix(0, 1);

fs.createReadStream(path.resolve(__dirname, 'mobile-phone-prices.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        y.addRow(
            [Number(row["price_range"])]
        );
        delete row["price_range"];

        let x = Object.values(row).map(v => Number(v))
        X.addRow(x);
    })
    .on('end', main)

function split(X, y, test_size = 0.25) {
    if (X.rows != y.rows)
        throw new exception("X ve y'nin satır sayıları aynı değil")

    let X_train = new Matrix(0, X.columns);
    let X_test = new Matrix(0, X.columns);
    let y_train = new Matrix(0, y.columns);
    let y_test = new Matrix(0, y.columns);

    const goal = Math.round(X.rows * test_size);
    let indices = shuffle([...Array(X.rows).keys()]);

    indices.slice(0, goal).forEach(i => {
        X_test.addRow(X.getRow(i));
        y_test.addRow(y.getRow(i));
    });
    indices.slice(goal).forEach(i => {
        X_train.addRow(X.getRow(i));
        y_train.addRow(y.getRow(i));
    })

    return [X_train, X_test, y_train, y_test];
}

function kappaFromMatrix(table) {
    const [[TP, FN], [FP, TN]] = table;
    const all = TP + TN + FP + FN;

    const po = (TP + TN) / all; // accuracy
    const p1 = (TP + FN) / all;
    const p2 = (TP + FP) / all;

    const pe = (p1 * p2) + ((1 - p1) * (1 - p2)); // random accuracy
    return (po - pe) / (1 - pe);
}

function main() {
    const labels = y.to1DArray().filter(onlyUnique).sort()

    console.log(X);
    console.log(y);
    console.log();

    let [X_train, X_test, y_train, y_test] = split(X, y);

    let model = new KNN(
        X_train.to2DArray(),
        y_train.to1DArray(),
        { k: 10 },
    );
    y_pred = model.predict(X_test.to2DArray());

    let confmat = ConfusionMatrix.fromLabels(y_test.to1DArray(), y_pred);

    console.log(`Accuracy: ${confmat.getAccuracy()}`);
    console.log();
    console.log("Confusion matrix:")
    console.log(new Matrix(confmat.getMatrix()));
    console.log()

    console.log("F1 Scores:");
    labels.forEach(i => console.log(` ${i}: ${confmat.getF1Score(i)}`));
    console.log();

    console.log("Kappa Scores:");
    labels.forEach(i => {
        let kappa = kappaFromMatrix(confmat.getConfusionTable(i));
        console.log(` ${i}: ${kappa}`);
    })

    let modelDump = JSON.stringify(model.toJSON());
    fs.writeFileSync(path.resolve(__dirname, "model.json"), modelDump);
}