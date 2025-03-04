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
                    const index = isComment(line)
                    if (index !== -1) {
                        console.log(line.slice(index));
                    }
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
