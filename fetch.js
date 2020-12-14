#!/usr/bin/env node

// Usage:
//  ./fetch.js       Fetches days that aren't available locally.
//                   Doesn't fetch days that are available
//                   locally.
//
//  ./fetch.js all   Fetches all of the days and overwrites the
//                   input.txt and README.md files if available.
//                   solution.js files are not touched.

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");

const baseURL = "https://adventofcode.com";

// Not the best parser but it works well enough
//FIXME: <code><*>content</*></code> is not supported. <*> is ignored.
function parseArticle(node, parent = null) {
	let parsed = "";
	let suffix = "";
	switch (node.nodeType) {
		case HTMLParser.NodeType.ELEMENT_NODE:
			if (parent && (parent.rawTagName === "code")) {
				break;
			}
			switch (node.rawTagName) {
				case "h2":
					return "";
				case "p":
					parsed += "\n";
					break;
				case "b":
				case "em":
					parsed += "**";
					suffix = "**";
					break;
				case "code":
					parsed += "`";
					suffix = "`";
					break;
				case "li":
					parsed += "- ";
					break;
				case "a":
					let url = node.attributes["href"];
					if (!url.startsWith("http")) {
						if (url.startsWith("/")) {
							url = baseURL + url;
						}
						else {
							break;
						}
					}
					parsed += "[";
					suffix = `](${url})`;
					break;
				case "pre":
					parsed += "``";
					suffix += "``";
					break;
			}
			break;
		case HTMLParser.NodeType.TEXT_NODE:
			let newline = "";
			if (parent.rawTagName === "pre") newline = "\n";
			parsed += node.rawText
				.replace("<code>", "`" + newline)
				.replace("\n</code>", "\n`")
				.replace("</code>", "\n`")
				.replace(/<\/?[a-z]+?>/g, "");
			break;
	}
	node.childNodes.forEach((child)=>{
		parsed += parseArticle(child, node);
	});
	return (parsed + suffix)
		.replace(/<\/?.*>/, "")
		.replace("&nbsp;", " ")
		.replace("&gt;", ">")
		.replace("&lt;", "<");
}

const cookie = fs.readFileSync("cookie.txt");
if (!cookie) {
	console.error(`${programName}: failed to read cookie.txt`);
	process.exit(1);
}

function get(path) {
	return fetch((baseURL + path), { headers:{ "Cookie": cookie } });
}

function getMain(path) {
	return new Promise((resolve, reject) => {
		get(path).then((res) => res.text().then((str) => {
			// Using regex to parse HTML isn't a good thing but
			// <main> is only ever used once in the document and
			// this is much easier than using the HTML parser to
			// extract the <main> tag
			const stripped = str.match(/(<main>.*?<\/main>)/sg);
			const html = HTMLParser.parse(
				stripped,
				{
					lowerCaseTagName: true,
					comment: false,
					blockTextElements: {
						script: false,
						noscript: false,
						style: false,
						pre: true
					}
				}
			);
			resolve(html);
		}));
	});
}

const programName = path.basename(process.argv[0]);

getMain("/events").then((main)=>{
	const links = main.querySelectorAll("a");
	links.forEach((link)=>{
		// Link => /:year
		const path = link.attributes["href"];
		const year = link.innerText.match(/^\[([0-9]*)\]$/)[1];
		if (!fs.existsSync(year)) {
			fs.mkdirSync(year);
		}
		getMain(path).then((main)=>{
			const links = HTMLParser.parse(main.querySelectorAll("pre")[0].rawText).querySelectorAll("a");
			links.forEach((link)=>{
				// Link: /:year/day/:day
				const path = link.attributes["href"];
				const pathMatches = path.match(/^\/([0-9]{4,})\/day\/([0-9]{1,2})$/);
				if (process.argv[2] !== "all") {
					if (fs.readdirSync(year).some((directoryName)=>{
						const directoryMatches = directoryName.match(/^Day ([0-9]{2})/);
						if (parseInt(directoryMatches[1]) === parseInt(pathMatches[2])) {
							return true;
						}
						return false;
					})) return;
				}
				getMain(path).then((main)=>{
					const articles = main.querySelectorAll("article");
					const nameElement = articles[0].querySelector("h2");
					const nameMatches = nameElement.innerText.replace("&apos;", "'").match(/^--- (Day ([0-9]{1,2}): (.+)) ---$/);
					const dirName = `Day ${nameMatches[2].padStart(2, "0")} - ${nameMatches[3]}`
					const dirPath = `${year}/${dirName.replace("/", "-").replace("\\", "-")}`;
					const header = nameMatches[1];
					console.log(`[${year}] ${header}`);
					if (!fs.existsSync(dirPath)) {
						fs.mkdirSync(dirPath);
					}
					let parsedArticle = "# " + header + "\n" + parseArticle(articles[0]);
					if (articles[1] != null) {
						parsedArticle += "\n## Part Two\n" + parseArticle(articles[1]);
					}
					fs.writeFileSync(`${dirPath}/README.md`, parsedArticle);
					get(path + "/input").then((res) => res.text().then((str) => {
						let trimmed = null;
						if (str.endsWith("\n")) {
							trimmed = str.substr(0, str.length-1);
						}
						else {
							trimmed = str;
						}
						fs.writeFileSync(`${dirPath}/input.txt`, trimmed);
					}));
					if (!fs.existsSync(`${dirPath}/solution.js`)) {
						fs.writeFileSync(`${dirPath}/solution.js`,
`module.exports = (input, part) => {
	// This function is the entry point for the solution.
};`
						);
					}
					if (!fs.existsSync(`${dirPath}/tests`)) {
						fs.mkdirSync(`${dirPath}/tests`);
					}
				});
			});
		});
	});
});