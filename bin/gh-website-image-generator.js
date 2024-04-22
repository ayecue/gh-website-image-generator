#!/usr/bin/env -S node --no-warnings

const version = require('../package.json').version;
const program = require('commander')
const { parseMeasurement } = require('../dist/utils.js');
const { transform } = require('../dist/index.js');
const { writeFileSync } = require('fs');
const path = require('path');

let options = {};

program.version(version);
program
  .arguments('<filepath>')
  .arguments('[width]')
  .arguments('[height]')
  .description('Generates GreyHack website with image.', {
    filepath: 'image to generate site with',
    width: 'output width of image',
    height: 'output height of image'
  })
  .action(function (filepath, width, height) {
    options.filepath = filepath;
    options.width = parseMeasurement(width, 64);
    options.height = parseMeasurement(height);
  })
  .option('-s, --scale <number>', 'scale of output')
  .option('-o, --output-directory <outputDirectory>', 'output directory')
  .option('-wa, --without-alpha', 'ignore alpha channel');

program.parse(process.argv);

options = Object.assign(options, program.opts());

async function main() {
  const output = await transform(options);
  const outputDirectory = options.outputDirectory ?? process.cwd();
  const outputPath = path.resolve(outputDirectory, 'image.html');

  writeFileSync(outputPath, output);
  console.log(`Created file at ${outputPath}!`);
}

main();