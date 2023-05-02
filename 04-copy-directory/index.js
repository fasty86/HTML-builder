const path = require('path');
const fs = require('fs').promises;

async function copyDir() {
  const dirPath = path.resolve(__dirname, 'files-copy');
  const copyPath = path.resolve(__dirname, 'files');

  const isExist = !!(await fs.stat(dirPath).catch((e) => false));

  if (!isExist) await fs.mkdir(dirPath);
  else
    (await fs.readdir(dirPath, { withFileTypes: true })).forEach(
      async (file) => {
        const clear = path.resolve(dirPath, file.name);
        await fs.unlink(clear);
      }
    );
  const files = await fs.readdir(copyPath, { withFileTypes: true });

  files
    .filter((file) => file.isFile())
    .forEach(async (file) => {
      const from = path.resolve(copyPath, file.name);
      const to = path.resolve(dirPath, file.name);
      await fs.copyFile(from, to).catch((e) => console.log(e));
    });
}

copyDir();
