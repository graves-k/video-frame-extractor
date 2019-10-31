const { spawn } = require('child_process');
const fs = require('fs');
const util = require('util');
const path = require('path');

/** Wrap the fs.read file in a promise */
const readdir = util.promisify(fs.readdir);

const extractVideoFramesToPNG = ({
  fileName,
  outputDir = '../test/videos/images',
}) => {
  const prefix = path.basename(fileName, path.extname(fileName));
  const cmd = 'ffmpeg';
  const args = [
    '-i',
    fileName,
    `${path.join(process.cwd(), outputDir, prefix)}%04d.png`,
    '-hide_banner',
  ];
  const proc = spawn(cmd, args);

  proc.stdout.on('data', data => console.log(data));

  proc.stderr.on('data', data => console.log(data));

  proc.on('close', () => console.log('finished'));
};

const extractFramesFromVideoDir = async ({
  dirName,
  outputDir = '../test/videos/images',
}) => {
  const dirPath = path.join(process.cwd(), dirName);
  const contents = await readdir(dirPath);
  const files = await contents
    .filter(c => !fs.lstatSync(path.join(dirPath, c)).isDirectory())
    .map(fName => path.join(dirPath, fName));
  files.forEach(fileName => extractVideoFramesToPNG({ fileName, outputDir }));
};

// extractVideoFramesToPNG({ fileName: '../test/videos/190929AA.TLV' });
extractFramesFromVideoDir({ dirName: '../test/videos' });
