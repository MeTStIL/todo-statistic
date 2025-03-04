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

function showComments(commentsArr) {
    const importanceArr = [];
    const authorArr = [];
    const dateArr = [];
    const commentArr = [];

    for (const comment of commentsArr) {
        importanceArr.push(comment.importance.toString());
        authorArr.push(comment.author.toString());
        dateArr.push(comment.date.toString());
        commentArr.push(comment.comment.toString());
    }
    const importanceMaxLen = Math.max(...importanceArr.map(x => x.length));
    const authorMaxLen = Math.max(...authorArr.map(x => x.length));
    const dateMaxLen = Math.max(...dateArr.map(x => x.length));
    const commentMaxLen = Math.max(...commentArr.map(x => x.length));

    for (const comment of commentsArr) {
        const row = (comment.importance > 0 ? '!' : '').padEnd(importanceMaxLen) + '  |  '
            + comment.author.padEnd(authorMaxLen) + '  |  '
            + comment.date.toString().padEnd(dateMaxLen) + '  |  '
            + comment.comment;
        console.log(row);
    }
}


function processCommand(input) {
    const [command, arg] = input.split(' ', 2);


    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showComments(allComments);
            break;

        case 'important':
            showComments(allComments.filter(comm => comm.importance > 0))
            break;

        case 'user':
            showComments(allComments.filter(comm => comm.author === arg.toLowerCase()))
            break;

        case 'sort':
            if (arg === 'importance') {
                showComments(allComments.sort((a, b) => b.importance - a.importance))
            }

            if (arg === 'user') {
                showComments(allComments.sort((a, b) => a.author.localeCompare(b.author)));
            }

            if (arg === 'date') {
                showComments(allComments.sort((a, b) => b.date - a.date));
            }
            break;

        case 'date':
            const argDate = new Date(arg);
            for (const comment of allComments) {
                if (comment.date >= argDate) {
                    console.log(comment.comment);
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
