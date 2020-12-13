function calculateFuelForMass(mass) {
	return Math.floor(mass / 3.0) - 2;
}

module.exports = (input, part) => {
	const masses = input.split("\n");
	let sum = 0;
	masses.forEach((massStr)=>{
		const inputMass = parseInt(massStr);
		if (part === 2) {
			let mass = 0;
			let fuel = calculateFuelForMass(inputMass);
			while (fuel > 0) {
				mass += fuel;
				fuel = calculateFuelForMass(fuel);
			}
			sum += mass;
		}
		else {
			sum += calculateFuelForMass(inputMass);
		}
	});
	return sum;
};