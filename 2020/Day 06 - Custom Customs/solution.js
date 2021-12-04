module.exports = (input, part) => {
	const groups = input.split("\n\n");
	let sum = 0;
	groups.forEach((group)=>{
		if (part === 1) {
			const set = new Set();
			group.match(/[a-z]/g).forEach((match)=>{
				set.add(match);
			});
			sum += set.size;
		}
		else if (part === 2) {
			const map = {};
			const people = group.split("\n");
			people.forEach((person)=>{
				person.match(/[a-z]/g).forEach((match)=>{
					map[match] = (map[match] ?? 0) + 1;
				});
			});
			Object.values(map).forEach((item)=>{
				if (item == people.length) {
					sum++;
				}
			});
		}
	});
	return sum;
};