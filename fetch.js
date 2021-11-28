#!/usr/bin/env node

// Usage:
//  ./fetch.js       Fetches days that aren't available locally.
//                   Doesn't fetch days that are available
//                   locally.
//
//  ./fetch.js all   Fetches all of the days and overwrites the
//                   input.txt and README.md files if available.
//                   solution.js files are not touched.

const USE_SUBSCRIPTS = false;
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const HTMLParser = require("node-html-parser");

const baseURL = "https://adventofcode.com";

// Not the best parser but it works well enough
//FIXME: <code><*>content</*></code> is not supported. <*> is ignored.
function parseArticle(node, spanHandler = null, parent = null) {
	function convertToSubscript(str) {
		const map = (
			USE_SUBSCRIPTS ?
			{
				"0":"₀", "1":"₁", "2":"₂", "3":"₃", "4":"₄", "5":"₅", "6":"₆",
				"7":"₇", "8":"₈", "9":"₉", "(":"₍", ")":"₎"
			} : 
			{
				"0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶",
				"7":"⁷", "8":"⁸", "9":"⁹", "(":"⁽", ")":"⁾"
			}
		);
		return `(${str})`.split("").map((x)=>map[x]).join("");
	}

	let parsed = "";
	let suffix = "";
	if (spanHandler == null) {
		spanHandler = (text) => null;
	}
	switch (node.nodeType) {
		case HTMLParser.NodeType.ELEMENT_NODE:
			if (parent && (parent.rawTagName === "code")) {
				break;
			}
			switch (node.rawTagName) {
				case "h2":
					return "";
				case "span":
					const title = node.attributes["title"];
					if (title != null) {
						const num = spanHandler(title);
						if (num != null) {
							node.appendChild(new HTMLParser.TextNode(
								convertToSubscript(num.toString())
							));
						}
					}
					break;
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
					parsed += "\n``";
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
		parsed += parseArticle(child, spanHandler, node);
	});
	return (parsed + suffix)
		.replace(/<\/?[a-z"'\ A-Z=]+>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<");
}

const cookie = fs.readFileSync("cookie.txt");

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
					let references = "";
					let counter = 0;
					const spanHandler = (text) => {
						references += `**[${++counter}]:** ${text}  \n`;
						return counter;
					}
					let parsedArticle = "# " + header + "\n" + parseArticle(articles[0], spanHandler);
					if (articles[1] != null) {
						parsedArticle += "\n## Part Two\n" + parseArticle(articles[1], spanHandler);
					}
					if (references !== "") {
						parsedArticle += `\n\n---\n\n` + references;
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
`module.exports = (input, part, isTest) => {
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