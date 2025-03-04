const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const allComments = []

for (const e of files) {
    const linesInFile = e.split('\r\n');
    for (line of linesInFile) {
        const comment = getComment(line);
        if (comment == null) continue;

        // определяем важность
        let importantCounter = 0;
        for (const element of comment) {
            if (element === '!') {
                importantCounter += 1;
            }
        }

        // определяем имя
        const author = comment.slice(8, comment.indexOf(';')).toString().toLowerCase();

        // дату
        let date = comment.slice(comment.indexOf(';') + 1, comment.indexOf(';', comment.indexOf(';') + 1)).toString().trim();
        date = new Date(date);

        // if (author.toLowerCase() === arg.toLowerCase()) {
        //     console.log(comment);
        // }

        allComments.push({
            comment: comment,
            importance: importantCounter,
            author: author,
            date: date
        })
    }
}


//console.log(require)
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(input) {
    const [command, arg] = input.split(' ', 2);


    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const comment of allComments) {
                console.log(comment.comment);
            }
            break;

        case 'important':
            for (const comment of allComments) {
                if (comment.importance !== 0) {
                    console.log(comment.comment);
                }
            }
            break;

        case 'user':
            for (const comment of allComments) {
                const author = comment.author;
                if (author === arg.toLowerCase()) {
                    console.log(comment.comment);
                }
            }
            break;

        case 'sort':
            if (arg === 'importance') {
                allComments.sort((a, b) => b.importance - a.importance);
                for (const comment of allComments) {
                    console.log(comment.comment);
                }
            }

            if (arg === 'user') {
                allComments.sort((a, b) => a.author.localeCompare(b.author));
                for (const comment of allComments) {
                    console.log(comment.comment);
                }
            }

            if (arg === 'date') {
                allComments.sort((a, b) => b.date - a.date);
                for (const comment of allComments) {
                    console.log(comment.comment);
                }
            }

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


// TODO Timofey; 2005-01-15; LALLLLL!!!!!
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
