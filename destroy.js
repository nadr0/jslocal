const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const load = require('./load.js');
const os = require('os');
const ProgressBar = require('progress');

/**
 * Read all *.pid files inside a project directory
 * to kill the processes
 * @param {String} projectName - name of the project directory
 */
const killJsLocal = (projectName) => {
  const syncPath = path.join(projectName);
  const files = fs.readdirSync(syncPath);
  const pids = getPIDFiles(files);
  const bar = new ProgressBar(`Killing all processes for ${projectName} [:bar]
    :percent`, {total: pids.length});

  pids.map((pidFile)=>{
    const filePath = path.join(projectName, pidFile);
    const pid = fs.readFileSync(filePath, 'utf-8');
    process.kill(pid);
    bar.tick();
  });
};

/**
 * Validates that the start flag was set when starting this application
 */
const validatorClean = (program) => {
  return program.clean;
};

/**
 * Validates that the start flag was set when starting this application
 */
const validatorKill = (program) => {
  return program.kill;
};

/**
 * Validates that the delete flag was set when starting this application
 */
const validatorDelete = (program) => {
  return program.delete;
};

/**
 * Parse the output of $(ls projectName/) output
 * The output of the ls command is a \n separated string
 */
const getPIDFiles = (files) => {
  // Only get files with .pid in the name.
  // This includes zxcv.pidzxcv, I don't care for now
  return files.filter((file)=>{return file.includes('.pid');});
};

const clean = (projectName) => {
  const cleanPath = path.join(projectName);
  const files = fs.readdirSync(cleanPath);

  const bar = new ProgressBar(`Cleaning files ${projectName} [:bar] :percent`, {
    total: 3
  });

  cleanJs(projectName);
  bar.tick();
  cleanCss(projectName);
  bar.tick();
  cleanPIDS(projectName);
  bar.tick();
};

const cleanPIDS = (projectName) => {
  const files = fs.readdirSync(projectName);
  const pidFiles = files.filter((file)=>{return file.includes('.pid');});

  pidFiles.map((file)=>{
    const filePath = path.join(projectName, file);
    fs.unlinkSync(filePath);
  });
};

const cleanCss = (projectName) => {
  const config = load.readConfig(projectName);

  if (config.css === 'scss') {
    const dir = 'css';
    const cssPath = path.join(projectName, dir);
    const files = fs.readdirSync(cssPath);
    files.map((file)=>{
      const filePath = path.join(projectName, dir, file);
      fs.unlinkSync(filePath);
    });
  }

};

const cleanJs = (projectName) => {
  const config = load.readConfig(projectName);

  if (config.javascript === 'es6') {
    const dir = 'browserify';
    const es6Path = path.join(projectName, dir);
    const files = fs.readdirSync(es6Path);
    files.map((file)=>{
      const filePath = path.join(projectName, dir, file);
      fs.unlinkSync(filePath);
    });
  }

  if (config.package) {
    const dir = 'browserify';
    const browserifyPath = path.join(projectName, dir);
    const files = fs.readdirSync(browserifyPath);
    files.map((file)=>{
      const filePath = path.join(projectName, dir, file);
      fs.unlinkSync(filePath);
    });
  }
};

/**
 * Delete the entire project folder and all its contents
 */
const deleteProjectFiles = (projectName) => {
  let numberOfDeletions = 0;

  const countFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        const curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          numberOfDeletions++;
          countFolderRecursive(curPath);
        } else {
          // file count
        }
      });
    }
  };

  countFolderRecursive(projectName);

  const bar = new ProgressBar(`Deleting ${projectName} [:bar] :percent`, {
    total: numberOfDeletions
  });

  // https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
  const deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        const curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
          bar.tick();
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
  deleteFolderRecursive(projectName);
};

module.exports = {
  killJsLocal: killJsLocal,
  clean: clean,
  deleteProjectFiles: deleteProjectFiles,
  validatorClean: validatorClean,
  validatorKill: validatorKill,
  validatorDelete: validatorDelete
};
