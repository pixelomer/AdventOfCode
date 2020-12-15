module.exports = (input, part) => {
	const descriptions = input.split("\n");
	let aunts = new Array();
	const knownData = {
		children: 3,
		cats: 7,
		samoyeds: 2,
		pomeranians: 3,
		akitas: 0,
		vizslas: 0,
		goldfish: 5,
		trees: 3,
		cars: 2,
		perfumes: 1
	};
	descriptions.forEach((aunt)=>{
		const id = parseInt(aunt.match(/^Sue ([0-9]+):/)[1]);
		const object = {
			id: id
		};
		aunt.split(": ").slice(1).join(": ").split(", ").forEach((pair)=>{
			const splitPair = pair.split(": ");
			object[splitPair[0]] = parseInt(splitPair[1]);
		});
		aunts.push(object);
	});
	aunts = aunts.filter((aunt)=>{
		const notTheRightOne = Object.keys(aunt).some((key)=>{
			if (part === 2) {
				switch (key) {
					case "id":
						return false;
					case "cats":
					case "trees":
						return aunt[key] <= knownData[key];
					case "pomeranians":
					case "goldfish":
						return aunt[key] >= knownData[key];
					default:
						return aunt[key] != knownData[key];
				}
			}
			else if (part === 1) {
				if (key == "id") return false;
				return aunt[key] != knownData[key];
			}
		});
		if (notTheRightOne) return false;
		return true;
	});
	
	if (aunts.length == 1) {
		return aunts[0].id;
	}

	return null;
};