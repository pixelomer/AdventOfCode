module.exports = (input, part) => {
	const list = input.split("\n")
		.map((val) => val.match(/^([a-z\ ]+) \(contains ([a-z,\ ]+)\)$/))
		.map((val) => ({ ingredients: val[1].split(" "), allergens: val[2].split(", ") }));
	let allergenMap = {};
	list.forEach((food) => {
		food.allergens.forEach((allergen) => {
			if (allergenMap[allergen] == null) {
				allergenMap[allergen] = [...food.ingredients];
			}
			else {
				allergenMap[allergen] = allergenMap[allergen]
					.filter((val) => food.ingredients.includes(val));
			}
		});
	});
	if (part === 1) {
		const set = new Set();
		Object.values(allergenMap).forEach((allergens) => {
			allergens.forEach((allergen) => {
				set.add(allergen);
			});
		});
		let sum = 0;
		list.forEach((food) => {
			sum += food.ingredients.length;
			set.forEach((allergen) => {
				if (food.ingredients.includes(allergen)) sum--;
			});
		});
		return sum;
	}
	else if (part === 2) {
		while (true) {
			Object.keys(allergenMap).forEach((key1) => {
				let possibilities = [...allergenMap[key1]];
				Object.keys(allergenMap).forEach((key2) => {
					if (key2 == key1) return;
					possibilities = possibilities.filter(value => !allergenMap[key2].includes(value));
				});
				if (possibilities.length >= 1) {
					allergenMap[key1] = possibilities;
				}
			});
			if (!Object.values(allergenMap).some((array) => (array.length > 1))) break;
		}
		let answer = "";
		Object.keys(allergenMap).sort().forEach((key) => {
			answer += allergenMap[key][0] + ",";
		});
		return answer.substr(0, answer.length-1);
	}
	return null;
};