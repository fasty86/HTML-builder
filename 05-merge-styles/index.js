const path = require('path');
const fs = require('fs').promises;
const { createWriteStream } = require('fs');

async function combine() {
  const dirPath = path.resolve(__dirname, 'project-dist');
  const bundlPath = path.resolve(dirPath, 'bundle.css');
  console.log(bundlPath);
  const sourcePath = path.resolve(__dirname, 'styles');
  const isExist = !!(await fs.stat(bundlPath).catch((e) => false));

  if (isExist) await fs.unlink(bundlPath);
  const writeStream = createWriteStream(bundlPath);
  const files = await fs.readdir(sourcePath, { withFileTypes: true });

  const all = await Promise.all(
    files
      .filter((file) => file.isFile() && file.name.split('.')[1] === 'css')
      .map(async (file) => {
        const pathToFile = path.resolve(sourcePath, file.name);
        const data = await fs.readFile(pathToFile, { encoding: 'utf8' });
        return data;
      })
  );
  all.forEach((part) => writeStream.write(part));
}

combine();
