const path = require('path');
const fs = require('fs').promises;
const { createWriteStream, createReadStream } = require('fs');

async function combine() {
  const dirPath = path.resolve(__dirname, 'project-dist');
  const bundlPath = path.resolve(dirPath, 'style.css');
  console.log(bundlPath);
  const sourcePath = path.resolve(__dirname, 'styles');
  const isExist = !!(await fs.stat(bundlPath).catch(() => false));

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

async function copyDir(source, target) {
  const dirPath = target;
  const copyPath = source;

  const isExist = !!(await fs.stat(dirPath).catch(() => false));

  if (!isExist) await fs.mkdir(dirPath);

  const files = await fs.readdir(copyPath, { withFileTypes: true });
  // console.log(files);

  files.forEach(async (file) => {
    if (file.isFile()) {
      const from = path.resolve(copyPath, file.name);
      const to = path.resolve(dirPath, file.name);
      await fs.copyFile(from, to).catch((e) => console.log(e));
    } else
      await copyDir(
        path.resolve(source, file.name),
        path.resolve(target, file.name)
      );
    // } else console.log(path.resolve(target, file.name));
  });
}

async function makeFolder() {
  const dirPath = path.resolve(__dirname, 'project-dist');
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath);
}
async function buldHtml() {
  const source = path.resolve(__dirname, 'template.html');
  const target = path.resolve(__dirname, 'project-dist', 'index.html');
  const componentsPath = path.resolve(__dirname, 'components');
  const writeableStream = createWriteStream(target);
  const readableHtmlStream = createReadStream(source, 'utf8');

  let rawHTML = '';
  for await (const chunk of readableHtmlStream) {
    rawHTML += chunk;
  }
  const components = await fs.readdir(componentsPath, { withFileTypes: true });
  await Promise.all(
    components.map(async (component) => {
      let data = '';
      const compPath = path.resolve(componentsPath, component.name);
      const rStream = createReadStream(compPath, 'utf8');
      for await (const chunk of rStream) {
        data += chunk;
      }
      let name = component.name.split('.')[0];
      // console.log(name);
      rawHTML = rawHTML.replace(`{{${name}}}`, data);
    })
  );
  writeableStream.write(rawHTML);
}

async function run() {
  await makeFolder();
  await combine();
  await copyDir(
    path.resolve(__dirname, 'assets'),
    path.resolve(__dirname, 'project-dist', 'assets')
  );
  await buldHtml();
}
run();
