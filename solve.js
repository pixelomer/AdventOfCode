#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const child_process = require('child_process');
const lzma = require('lzma-native');
require("./utilities");

/*
argv = [
	"node",
	"solve.js",
	"<year>",
	"<day>",
	"<part>"
] 
*/

async function main() {
	let cookie = null;
	if (!fs.existsSync("cookie.txt")) {
		console.error("WARNING: cookie.txt is missing. Will not submit answers.");
	}
	else {
		cookie = fs.readFileSync("cookie.txt", { encoding: 'utf-8' });
	}

	const consoleLogOrig = console.log;
	const consoleErrorOrig = console.error;

	function removeConsoleLog() {
		console.log = console.error = (...args) => {
			consoleErrorOrig("[solver]", ...args);
		};
	}

	function restoreConsoleLog() {
		console.log = consoleLogOrig;
		console.error = consoleErrorOrig;
	}

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
	let executionTime;

	try {
		let testsFailed = false;
		if (fs.existsSync(`${process.cwd()}/tests`)) {
			for (let fileName of fs.readdirSync(`${process.cwd()}/tests`)) {
				if (fileName.startsWith(".")) return;
				let testData;
				const testPath = `${process.cwd()}/tests/${fileName}`;
				if (fileName.endsWith(".xz")) {
					try {
						const compressedStream = fs.createReadStream(testPath);
						const decompressor = lzma.createDecompressor();
						compressedStream.pipe(decompressor);
						const chunks = [];
						process.stderr.write(`${programName}: decompressing test... `);
						testData = await new Promise((resolve, reject) => {
							decompressor.on('data', (chunk) => chunks.push(chunk));
							decompressor.on('error', (err) => reject(err));
							decompressor.on('end', () => resolve(Buffer.concat(chunks)));
						});
						const size = Math.round(100 * testData.length / (1024 * 1024)) / 100; 
						console.error(`${size} MiB`);
						testData = testData.toString('utf-8');
					}
					catch (err) {
						console.error(err);
						console.error(`${programName}: failed to decompress test "${fileName}", skipping`);
						continue;
					}
				}
				else if (fileName.endsWith(".txt")) {
					testData = fs.readFileSync(testPath, { encoding: 'utf-8' });
				}
				else {
					continue;
				}
				const splitTestData = testData.split("\n");
				testData = splitTestData.slice(1).join("\n");
				const expectedAnswers = splitTestData[0].split("|");
				delete splitTestData;
				async function test(part) {
					if (expectedAnswers.length < part) return;
					if (expectedAnswers[part-1].length <= 0) return;
					const start = Date.now();
					removeConsoleLog();
					const result = await solve(testData, part, true);
					restoreConsoleLog();
					const end = Date.now();
					if (result != expectedAnswers[part-1]) {
						console.error(`${programName}: test "${fileName}" failed (expected ${expectedAnswers[part-1]}, got ${result})`);
						testsFailed = true;
					}
					else {
						console.error(`${programName}: test "${fileName}" passed in ${(end - start)/1000.0}s`);
					}
				}
				await test(partNumber);
			}
		}
		if (testsFailed) {
			process.exit(1);
		}
		removeConsoleLog();
		const start = Date.now();
		result = await solve(inputString, partNumber, false);
		executionTime = (Date.now() - start) / 1000.0;
		restoreConsoleLog();
	}
	catch (err) {
		console.error(err.stack);
		result = null;
	}

	if (result != null) {
		console.log(result);
		console.log(`${programName}: solved in ${executionTime}s`);
		if (typeof result === 'bigint') {
			result = result.toString();
		}
		if ((cookie != null) && ((typeof result === 'string') || ((typeof result === 'number') && !isNaN(result)))) {
			process.stdout.write("Terminate program to cancel submission...");
			setTimeout(() => {
				console.log("\nSubmitting answer...");
				const data = `level=${partNumber}&answer=${encodeURIComponent(result)}`;
				const referer = `https://adventofcode.com/${+yearString}/day/${+dayString}`;
				const url = `${referer}/answer`;
				fetch(url, {
					method: 'POST',
					headers: {
						'Cookie': cookie,
						'Content-Type': 'application/x-www-form-urlencoded',
						'Referer' : referer
					},
					body: data
				}).then((response) => {
					if (response.status === 200) {
						return response.text();
					}
					else {
						console.log("Could not submit answer.");
						process.exit(1);
					}
				}).then((text) => {
					if (text.includes("You don't seem to be solving the right level.")) {
						console.log("This part has been solved before.");
						return fetch(referer, {
							headers: {
								'Cookie': cookie
							}
						});
					}
					else if (text.includes("That's the right answer!")) {
						console.log("Solved!");
						const children = [];
						process.chdir("../..");
						if (partNumber == 1) {
							if (process.platform === 'darwin') {
								children.push(child_process.spawn("open", [referer]));
							}
							children.push(child_process.spawn("node", ["fetch",
								`${yearString}-${parseInt(dayString)}`]));
						}
						else {
							process.exit(0);
						}
						Promise.all(children.map((child) =>
							new Promise((resolve) => child.on("exit", () => resolve()))
						)).then(() => process.exit(0));
					}
					else if (text.includes("You gave an answer too recently")) {
						console.log("You gave an answer too recently.");
						const match = text.match(/You have ([0-9ms ]+?) left to wait/);
						if (match != null) {
							console.log(`Try again in ${match[1]}.`);
						}
						process.exit(1);
					}
					else if (text.includes("your answer is too high")) {
						console.log("Your answer is too high.");
					}
					else if (text.includes("your answer is too low")) {
						console.log("Your answer is too low.");
					}
					else if (text.includes("That's not the right answer")) {
						console.log("That's not right...");
					}
					else {
						console.log("Couldn't parse response.");
						process.exit(1);
					}
					const match = text.match(/[Pp]lease wait ([0-9]+) minute(s?) before trying again/);
					if (match != null) {
						console.log(`Please wait ${match[1]} minute${match[2]} before trying again.`);
					}
					process.exit(1);
				}).then((response) => {
					if (response.status === 200) {
						return response.text();
					}
					else {
						console.log("Could not fetch correct answer.");
						process.exit(1);
					}
				}).then((text) => {
					text = text.replace(/\n/mg, "");
					let match;
					if (partNumber == 1) {
						match = text.match(/<p>Your puzzle answer was <code>([^<]+)<\/code>\.<\/p>.*--- Part Two ---/);
					}
					else {
						match = text.match(/--- Part Two ---.*<p>Your puzzle answer was <code>([^<]+)<\/code>\.<\/p>/);
					}
					const correctAnswer = match[1];
					if (correctAnswer == result) {
						console.log("The answer was correct.");
						process.exit(0);
					}
					else {
						console.log(`Incorrect answer. The correct answer was ${correctAnswer}.`);
						process.exit(1);
					}
				});
			}, 1000);
		}
	}
	else {
		console.error(`${programName}: failed to solve challange`);
		process.exit(1);
	}
}

main();