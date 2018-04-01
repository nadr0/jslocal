#! /usr/bin/env node
const program = require('commander');
const newCommand = require('./new.js');
const load = require('./load.js');
const destroy = require('./destroy.js');
const prompt = require('prompt-sync')();

program
  .version('0.1.0')
  .option('-n, --new', 'Create a new project', true)
  .option('-s, --start [name]', 'Boots the environment for a given project to start developing [name]')
  .option('-d, --delete [name]', 'Delete a project and all its files [name]')
  .option('-k, --kill [name]', 'Kills all processes related to the project [name]')
  .option('-c, --clean [name]', 'Cleans up the directory and removes all processed files, (Like a make clean command) [name]')
  .parse(process.argv);


// If no arguments were provided
if (process.argv.length < 3) {
  program.help();
}

// Handle project creation
if (newCommand.validator(program)) {

  // Get project Name
  const projectNameQuestion = 'Name of project:';
  let projectName = prompt(projectNameQuestion);
  while (projectName === '') {
    projectName = prompt(projectNameQuestion);
  }

  // Get javascript version
  const javascriptQuestion = 'Javascript version, vanilla (default) or es6: ';
  let javascriptVersion = prompt(javascriptQuestion);
  // Default to vanilla
  javascriptVersion = javascriptVersion === '' ? 'vanilla' : javascriptVersion;
  while (javascriptVersion !== 'vanilla' && javascriptVersion !== 'es6') {
    javascriptVersion = prompt(javascriptQuestion);
  }

  // Get css version
  const cssQuestion = 'CSS version, css (default) or scss: ';
  let cssVersion = prompt(cssQuestion);
  cssVersion = cssVersion === '' ? 'css' : cssVersion;
  while (cssVersion !== 'css' && cssVersion !== 'scss') {
    cssVersion = prompt(cssQuestion);
  }

  // Get npm mode
  const npmQueston = 'Do you want to enable NPM with this project (y/N)?';
  const npmPackageValue = prompt(npmQueston).toLowerCase();
  let npmPackage = false;
  npmPackage = npmPackageValue === 'n' ? false : true;
  npmPackage = npmPackageValue === '' ? false : true;

  const projectConfig = {
    new: projectName,
    javascript: javascriptVersion,
    npmPackage: npmPackage,
    css: cssVersion
  };

  newCommand.project(projectConfig);
}

// Handle project start
if (load.validator(program)) {
  load.loadProject(program.start);
}

// Handle project clean
if (destroy.validatorClean(program)) {
  destroy.clean(program.clean);
}

// Handle project kill
if (destroy.validatorKill(program)) {
  destroy.killJsLocal(program.kill);
}

// Handle project deletion
if (destroy.validatorDelete(program)) {
  destroy.deleteProjectFiles(program.delete);
}

// Handle killing!
process.on('SIGINT', function() {

  // Kill the program
  destroy.killJsLocal(program.start);
  process.exit();
});
