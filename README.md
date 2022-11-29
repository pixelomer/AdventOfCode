# Advent of Code Solutions

These are my solutions for Advent of Code. I was still new to JavaScript when I started solving Advent of Code puzzles so some of the solutions here could be really bad.

These solutions were made for node.js v16.13.0 and may not work for older versions.

## Scripts

### `./fetch.js [all]`

Fetches day inputs and descriptions from Advent of Code and places them into the correct folders. Specify `all` as the first argument to fetch everything even if some of them are already available locally. You must have a valid cookie in the `cookie.txt` file for this script to work.

### `./solve.js <year> <day> <part>`

Loads the `solution.js` file from the correct directory based on the arguments and calls the exported function. If the function returns something other than `null` or `undefined`, it prints this value. Otherwise it prints an error to stderr and exists with a non-zero exit code. If there is a `tests` folder in the day directory, each test performed for the given part before running the program with the actual input.

### `utilities.js`

This isn't really a script. `solve.js` includes this file before calling the function in `solution.js`. This file contains small utilities that make some things easier.