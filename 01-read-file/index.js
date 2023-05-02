const fs = require('fs');
const path = require('path');


async function readFile(filename) {
  const root = path.resolve(__dirname, filename);
  const readStream = fs.createReadStream(root, { encoding: 'utf8' });
  for await (const chunk of readStream) {
    console.log(chunk);
  }
}
readFile('text.txt');