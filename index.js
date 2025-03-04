const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

//console.log(require)
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;

        case 'show':
            for (const e of files) {
                const linesInFile = e.split('\r\n');
                for (line of linesInFile) {
                    const comment = getComment(line);
                    if (comment !== null)
                        console.log(comment);
                }

            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getStringBounds(str) {
    const bounds = [];
    let isBound = false;
    let bound = [];
    let quote = '';
    for (let i = 0; i < str.length; i++) {
        const symbol = str[i];
        if (!isBound && ['\'', '"', '`'].includes(symbol)) {
            isBound = true;
            bound.push(i);
            quote = symbol;
        } else if (isBound && symbol === quote) {
            isBound = false;
            bound.push(i);
            quote = '';
            bounds.push(bound)
        }
    }
    return bounds;
}

function isCommentInString(index, stringBounds) {
    return stringBounds.some(([fr, to]) => fr < index && index < to);
}

function getComment(str) {
    // возвращает комметарий из строики, если он там есть
    // если нет - вернет null

    const commentPattern = '// TODO ';
    const stringBounds = getStringBounds(str)

    let index = -1;
    while ((index = str.indexOf(commentPattern, index + 1)) !== -1) {
        if (!isCommentInString(index, stringBounds)) {
            return str.slice(index)
        }
    }
    return null;
}

function isComment(str) {
    const strTrim = str.trim();
    return str.indexOf();
}

// TODO you can do it!
