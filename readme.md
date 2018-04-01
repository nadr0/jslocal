# jslocal (javascript local)

An offline version of javascript sandboxes.

Your sandbox contains 1 Javscript file, 1 HTML file and 1 CSS file.

Couldn't I just setup a project with my own HTML & JS & CSS and build processes myself? Why do I need this?

You don't need this and you could do that!

This CLI provides an easy way to create a development environment quickly. 

# Install

## Global 

`npm install -g jslocal`

This will use the node_modules installed globally on your computer.

`$ jslocal` should work anywhere.

## Local

`npm init`
`npm install jslocal`

`$ npx jslocal` 

This will grab all the packages installed in the local node_modules folder instead of global.

# Usage
```
jslocal --help

  Usage: jslocal [options]

  Options:

    -V, --version        output the version number
    -n, --new            Create a new project
    -s, --start [name]   Boots the environment for a given project to start developing [name]
    -d, --delete [name]  Delete a project and all its files [name]
    -k, --kill [name]    Kills all processes related to the project [name]
    -c, --clean [name]   Cleans up the directory and removes all processed files, (Like a make clean command) [name]
    -h, --help           output usage information
```

# Supported build processes

## Vanilla (duh)

- HTML
- Javascript
- CSS

## Libraries

- es6 (babel)
- client side package importing (NPM, with browserify)
- sass

# Reason for developing this package

I do not like how some online javascript sandboxes are bloated and buggy at times. I also do not like how the files are not stored on my computer. I enjoy using my own text editors (spacemacs).

I used a simpler version of this tool written in Bash and Make for work related tasks. I decided to convert it into a CLI application written in node.js to easily publish for others. 

# Improvements

- Servers?
- More javascript environments
- Multiple files for the current version instead of 1 JS, 1 HTML, 1 CSS
