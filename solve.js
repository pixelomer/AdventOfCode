#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
require("./utilities")

/*
argv = [
	"node",
	"solve.js",
	"<year>",
	"<day>",
	"<part>"
] 
*/

const programName = path.basename(process.argv[1]);

if (
	(process.argv.length !== 5) ||
	!process.argv[2].match(/^[2-9][0-9]{3}$/g) ||
	!process.argv[3].match(/^(?:[0-2]?[0-9])|(?:3[0-1])$/) ||
	!process.argv[4].match(/^[1-2]$/)
) {
	console.error(`Usage: ${programName} <year> <day> <part>`);
	process.exit(1);
}

const yearString = process.argv[2];
const dayString = (
	((process.argv[3].length === 2) ? "" : "0")
	+ process.argv[3]
);
const yearDirectory = fs.opendirSync(yearString);

if (yearDirectory == null) {
	console.error(`${programName}: invalid year: ${yearString}`);
	process.exit(1);
}

let dayDirectory = null;
while (dayDirectory = yearDirectory.readSync()) {
	if (dayDirectory.name.match(new RegExp(`^Day ${dayString} \\-`, 'g'))) {
		break;
	}
}

if (dayDirectory == null) {
	console.error(`${programName}: invalid day: ${dayString}`);
	process.exit(1);
}

process.chdir(`${yearDirectory.path}/${dayDirectory.name}`);
yearDirectory.closeSync();

const inputString = fs.readFileSync("input.txt").toString();

if (inputString == null) {
	console.error(`${programName}: failed to read input.txt`);
}

const partNumber = parseInt(process.argv[4]);
let solve = require(`${process.cwd()}/solution.js`);

let result;

try {
	if (fs.existsSync(`${process.cwd()}/tests`)) {
		fs.readdirSync(`${process.cwd()}/tests`).forEach((fileName)=>{
			if (fileName.startsWith(".") || !fileName.endsWith(".txt")) return;
			let testData = fs.readFileSync(`${process.cwd()}/tests/${fileName}`).toString();
			const splitTestData = testData.split("\n");
			testData = splitTestData.slice(1).join("\n");
			const expectedAnswers = splitTestData[0].split(",");
			delete splitTestData;
			function test(part) {
				if (expectedAnswers.length < part) return;
				if (expectedAnswers[part-1].length <= 0) return;
				const result = solve(testData, part);
				if (result != expectedAnswers[part-1]) {
					console.error(`${programName}: test "${fileName}" failed for part ${part} (expected ${expectedAnswers[part-1]}, got ${result})`);
					process.exit(1);
				}
			}
			test(partNumber);
		});
	}
	result = solve(inputString, partNumber);
}
catch (err) {
	console.error(err.stack);
	result = null;
}

if (result != null) {
	console.log(result);
	process.exit(0);
}

console.error(`${programName}: failed to solve challange`);
process.exit(1);