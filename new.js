const fs = require('fs');
const path = require('path');
const util = require('./util.js');

/**
 * Validates argv to determine if there are enough parameters
 */
const validator = (program) => {
  return program.new;
};

/**
 * Create a new project
 */
const project = (program) => {
  createProjectFolder(program);
  writeConfig(program);
  writeJavascript(program);
  writeCSS(program);
  writeSCSS(program);
  writeHTML(program);

  if (program.javascript === 'es6') {
    writeBabel(program);
    writeJavascriptPlaceHolders(program);
  }

  if (program.npmPackage) {
    writeWatchify(program);
  }
};

const createProjectFolder = (program) => {
  util.mkDirByPathSync(`${program.new}`);
};

const writeConfig = (program) => {
  var config = {
    'javascript':'',
    'css':'',
    'package':''
  };

  config.javascript = program.javascript;
  config.css = program.css;
  config.package = program.npmPackage;

  const configPath = path.join(program.new, 'config.json');
  fs.writeFileSync(configPath,JSON.stringify(config), 'utf-8');
};


const writeJavascript = (program) => {
  const pathName = 'js';
  const dirPath = path.join(program.new, pathName);
  util.mkDirByPathSync(dirPath);
  const filePath = path.join(program.new, pathName, 'index.js');
  fs.writeFileSync(filePath,'','utf-8');
};

const writeJavascriptPlaceHolders = (program) => {
  /*
   * If a project has both Babel and Watchify there is a race condition when
   * booting the applications. Watchify expects a file to exist from babel
   * but babel has not ran yet. Instead of waiting for babel to initially start
   * and transpile the index.js file I will write a place holder that is
   * out of date for Watchify can just transpile that file instead.
   */
  const pathName = 'compiled';
  const dirPath = path.join(program.new, pathName);
  util.mkDirByPathSync(dirPath);
  const filePath = path.join(program.new, pathName, 'index-compiled.js');
  fs.writeFileSync(filePath,'','utf-8');
};

const writeBabel = (program) => {
  const dirPath = path.join(program.new, 'compiled');
  util.mkDirByPathSync(dirPath);
};

const writeWatchify = (program) => {
  const dirPath = path.join(program.new, 'browserify');
  util.mkDirByPathSync(dirPath);
};

const writeCSS = (program) => {
  const dirPath = path.join(program.new, 'css');
  util.mkDirByPathSync(dirPath);
  const filePath = path.join(program.new, 'css', 'styles.css');
  fs.writeFileSync(filePath,'','utf-8');
};

const writeSCSS = (program) => {
  if (program.css != 'scss') {return;}
  const dirPath = path.join(program.new, 'scss');
  util.mkDirByPathSync(dirPath);
  const filePath = path.join(program.new, 'scss', 'styles.scss');
  fs.writeFileSync(filePath,'','utf-8');
};

const createJavascriptPath = (program) => {
  if (program.javascript === 'vanilla') {
    const javascriptPath = path.join('js','index.js');
    return `<script src='${javascriptPath}'></script>`;
  } else if (program.javascript === 'es6' && program.npmPackage) {
    const javascriptPath = path.join('browserify','index-compiled-browserify.js');
    return `<script src='${javascriptPath}'></script>`;
  } else if (program.javascript === 'es6') {
    const javascriptPath = path.join('compiled', 'index-compiled.js');
    return `<script src='${javascriptPath}'></script>`;
  }
};

const createCSSPath = (program) => {
  const cssPath = path.join('css','styles.css');
  return `<link rel="stylesheet" href="${cssPath}">`;
};

const writeHTML = (program) => {
  const jsPath = createJavascriptPath(program);
  const cssPath = createCSSPath(program);

  const html = `<html>
  <head>
    ${jsPath}
    ${cssPath}
  </head>
  <body>
    Hello World!
  </body>
</html>
  `;

  const filePath = path.join(program.new, 'index.html');
  fs.writeFileSync(filePath,html,'utf-8');
};

module.exports = {
  validator: validator,
  project: project
};
