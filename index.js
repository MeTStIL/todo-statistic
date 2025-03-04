const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const allComments = []

for (const e of files) {
    const linesInFile = e.split('\r\n');
    for (line of linesInFile) {
        const index = isComment(line)
        if (index !== -1) {
            allComments.push(line.slice(index));
        }
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
                console.log(comment)
            }
            break;

        case 'important':
            for (const comment of allComments) {
                if (comment.indexOf('!') !== -1) {
                    console.log(comment)
                }
            }
            break;

        case 'user':

            for (const comment of allComments) {
                const author = comment.slice(8, comment.indexOf(';'))
                if (author.toLowerCase() === arg.toLowerCase()) {
                    console.log(comment)
                }
            }
            break;

        default:
            console.log('wrong command');
            break;
    }
}

function isComment (str) {
    const strTrim = str.trim();
    return str.indexOf('// TODO ');
}

// TODO you can do it!
