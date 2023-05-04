const fs = require('fs');
const path = require('path');
const process = require('process');
const readLine = require('readline').promises;

const root = path.resolve(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(root);
const rl = readLine.createInterface({ input: process.stdin, output: process.stdout });

console.log('You can type somthing in terminal if you want?');

rl.on('line', data => {
  if (data === 'exit')  rl.close();
  else writeStream.write(`${data}\n`);
});
process.on('beforeExit', () => {
  exit();
});
function exit() {
  console.log('Goodbye!');
}