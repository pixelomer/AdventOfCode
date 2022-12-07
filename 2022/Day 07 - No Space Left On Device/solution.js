module.exports = (input, part, isTest) => {
	const root = new Map();
	root.set("..", root);
	root.set("/", root);
	let cwd = root;
	for (const line of input.split("\n")) {
		const argv = line.split(" ");
		if (argv[0] === "$") {
			switch (argv[1]) {
				case "cd":
					cwd = cwd.get(argv[2]);
					break;
				case "ls":
					break;
			}
			continue;
		}
		if (argv[0] === "dir") {
			const name = argv[1];
			if (cwd.has(name)) continue;
			const dir = new Map();
			dir.set("..", cwd);
			dir.set("/", root);
			cwd.set(name, dir);
		}
		else {
			const name = argv[1];
			if (cwd.has(name)) continue;
			const size = +argv[0];
			cwd.set(name, size);
		}
	}

	const sizes = [];

	/** @param {Map} dir */
	function getSize(dir) {
		if (dir.has("__size")) {
			return dir.get("__size");
		}
		let sum = 0;
		for (const name of dir.keys()) {
			if ((name === "/") || (name === "..")) {
				continue;
			}
			const entry = dir.get(name);
			if (typeof entry === 'number') {
				sum += entry;
			}
			else {
				sum += getSize(entry);
			}
		}
		sizes.push(sum);
		dir.set("__size", sum);
		return sum;
	}

	function totalSum(dir) {
		let sum = 0;
		for (const name of dir.keys()) {
			if ((name === "/") || (name === "..")) {
				continue;
			}
			const entry = dir.get(name);
			if (typeof entry === 'number') {
				continue;
			}
			else {
				let size = getSize(entry);
				if (size <= 100000) {
					sum += size;
				}
				sum += totalSum(entry);
			}
		}
		return sum;
	}

	if (part === 1) {
		return totalSum(root);
	}


	let totalSpace = getSize(root);
	let requiredSpace = 30000000 - (70000000 - totalSpace);
	return sizes.filter((a) => a >= requiredSpace).sort((a,b) => a-b)[0];
};