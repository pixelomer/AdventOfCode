module.exports = (input, part, isTest) => {
	let fish = {};
	for (const num of input.split(",")) {
		fish[num] = (fish[num] ?? 0) + 1;
	}
	for (let i=0; i<=8; i++) {
		fish[i] = fish[i] ?? 0;
	}
	for (let i=0; i<((part === 2) ? 256 : 80); i++) {
		const newFish = {};
		newFish[6] = fish[0];
		newFish[8] = fish[0];
		for (let j=0; j<8; j++) {
			newFish[j] = (newFish[j] ?? 0) + (fish[j+1] ?? 0);
		}
		fish = newFish;
	}
	return Object.values(fish).reduce((a,b) => a+b, 0);
};