const path = require('path');
const fs = require('fs').promises;

async function readDir(folderName) {
  const root = path.resolve(__dirname, folderName);
  try {
    const files = await fs.readdir(root, { withFileTypes: true });
    // console.log(files);
    files
      .filter((file) => file.isFile())
      .forEach(async (file) => {
        const root = path.resolve(__dirname, folderName, file.name);
        const stat = await fs.stat(root);
        const [name, ext] = file.name.split('.');
        console.log(`${name} - ${ext} - ${stat.size / 1024}kb`);
      });
  } catch (error) {
    console.log(error);
  }
}
readDir('secret-folder');
