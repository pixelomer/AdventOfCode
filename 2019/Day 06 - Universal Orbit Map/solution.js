module.exports = (input, part) => {
	input = input.split("\n").reduce((acc, val) => {
		const split = val.split(")");
		if (!acc.has(split[0])) {
			acc.set(split[0], []);
		}
		acc.get(split[0]).push(split[1]);
		return acc;
	}, new Map());

	if (part === 1) {
		function findObjectCount(object, multiplier = 0) {
			const array = input.get(object);
			if (array == null) return 0;
			let count = array.length + (array.length * multiplier);
			count += array.reduce(
				((acc, object) => acc + findObjectCount(object, multiplier+1)),
				0
			);
			return count;
		}

		return findObjectCount("COM");
	}
	else {
		function findPath(object) {
			const path = [object];
			let currentObject = object;
			while (currentObject !== "COM") {
				const iterator = input.entries();
				let entry = iterator.next();
				while (!entry.done) {
					const pair = entry.value
					if (pair[1].includes(currentObject)) {
						const newObject = pair[0];
						path.unshift(newObject);
						currentObject = newObject;
						break;
					}
					entry = iterator.next();
				}
				if (entry.done) {
					// This object is not connected to COM
					// The data is probably corrupted
					break;
				}
			}
			return path;
		}
		
		function findDistanceBetween(object1, object2) {
			const object1Path = findPath(object1);
			const object2Path = findPath(object2);
			while (object1Path[0] === object2Path[0]) {
				object1Path.splice(0, 1);
				object2Path.splice(0, 1);
			}
			return object1Path.length + object2Path.length - 2;
		}

		return findDistanceBetween("SAN", "YOU");
	}
};