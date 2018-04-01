const fs = require('fs');
const path = require('path');
const {execSync, spawn, spawnSync} = require('child_process');
const os = require('os');

/**
 * Given a string remove all the newline characters present
 * @param {String} line - the string to remove newline characters
 */
const removeNewlines = (line) => {
  const newLineRegex = new RegExp(os.EOL,'g');
  return line.replace(newLineRegex,'');
};

/* Path to boot local binaries of NPM packages */
/* This is maybe bad on windows... */
const npmBinPath = removeNewlines(execSync('npm bin').toString());

/**
 * Validates that the start flag was set when starting this application
 */
const validator = (program) => {
  return program.start;
};

/**
 * Read the config.json file inside the project directory
 * @param {String} projectName - name of the project to read the config.json
 */
const readConfig = (projectName) => {
  const configPath = path.join(projectName, 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath,'utf-8'));
  return config;
};

/**
 * Read the config json file inside a project directory and start all
 * necessary processes. This will be called when someone provides a projectname
 * and -s or --start flag
 * @param {String} projectName - name of the project to start
 */
const loadProject = (projectName) => {
  const config = readConfig(projectName);
  let hasProcess = false;

  console.log(`Starting ${projectName} ...`);

  if (config.css === 'scss') {
    hasProcess = true;
    console.log(`Booting Sass`);
    bootSass(projectName);
  }
  if (config.javascript === 'es6') {
    hasProcess = true;
    console.log(`Booting Babel`);
    bootBabel(projectName);
  }
  if (config.package) {
    hasProcess = true;
    console.log(`Booting Watchify`);
    bootWatchify(projectName);
  }

  console.log(`Boot process completed.`);

  if (hasProcess === false) {
    console.log(`You do not have to start this project.`
                + ` The config has no processes.`);
    console.log(`Check out the config file in the project for more details.`);
  }
};

/**
 * Listens to stdout and stderr for a spawned process
 * @param {Object} app - spawn object from node's child_process module
 * @param {String} appName - name of the application that was spawned
 */
const outputHandler = (app, appName) => {
  app.stdout.on('data', (data) => {
    console.log(`${appName} stdout: ${data}`);
  });
  app.stderr.on('data', (data) => {
    console.log(`${appName} stderr: ${data}`);
  });
  app.on('close', (code) => {
    console.log(`${appName} closing code: ${code}`);
  });
}

/**
 * Starts the watchify to compile the transpiled js file to import NPM packages
 * @param {String} projectName - name of the project to compile the
 *   transpiled JS file
 */
const bootWatchify = (projectName) => {
  const watchifyBinPath = path.join(npmBinPath, 'watchify');
  const inputFilePath = path.join(projectName, 'compiled', 'index-compiled.js');
  const outputFilePath = path.join(projectName, 'browserify',
                                   'index-compiled-browserify.js');
  console.log(inputFilePath, outputFilePath);
  const watchify = spawn(watchifyBinPath,[inputFilePath, '-o',
                         outputFilePath],
                         {detached: true});
  outputHandler(watchify, 'watchify');
  writePID(projectName, 'watchify', watchify.pid);
};

/**
 * Starts the sass watcher to compile the scss file into css
 * @param {String} projectName - name of the project to compile the SCSS file
 */
const bootSass = (projectName) => {
  const sassBinPath = path.join(npmBinPath, 'node-sass');
  const inputFilePath = path.join(projectName, 'scss');
  const outputFilePath = path.join(projectName, 'css');
  const sass = spawn(sassBinPath, ['-w', inputFilePath, '-o',
                              outputFilePath, '&'], {
                               detached: true
                             });
  outputHandler(sass, 'sass');
  writePID(projectName, 'sass', sass.pid);
};

/**
 * Starts the babel compiler to watch the js file
 * @param {String} projectName - name of the project to compile the JS file
 */
const bootBabel = (projectName) => {
  const babelBinPath = path.join(npmBinPath, 'babel');
  const inputFilePath = path.join(projectName, 'js', 'index.js');
  const outputFilePath = path.join(projectName, 'compiled', 'index-compiled.js');
  const babel = spawn(babelBinPath,
                      [inputFilePath,'--watch','--out-file', outputFilePath],
                      {detached: true});
  outputHandler(babel, 'babel');
  writePID(projectName, 'babel', babel.pid);
};

/**
 * Write a PID to a file to read at a later point to kill that process
 * @param {String} projectName - name of a project to write the PID files into
 * @param {String} filename - filename to store the PID value
 * @param {String} pid - the pid from the process that was started
 */
const writePID = (projectName, filename, pid) => {
  const filePath = path.join(projectName, `${filename}.pid`);
  fs.writeFileSync(filePath, pid, 'utf-8');
};

module.exports = {
  validator: validator,
  loadProject: loadProject,
  readConfig: readConfig
};
