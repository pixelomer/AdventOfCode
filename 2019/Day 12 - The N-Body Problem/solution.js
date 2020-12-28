module.exports = (input, part, isTest) => {
	const moons = input.split("\n").map((val) => {
		const match = val.match(/<x=(-?[0-9]+), y=(-?[0-9]+), z=(-?[0-9]+)>/);
		return {
			position: {
				x: parseInt(match[1]),
				y: parseInt(match[2]),
				z: parseInt(match[3])
			},
			velocity: { x:0, y:0, z:0 }
		};
	});

	function timeStep() {
		// Step 1: Velocity changes
		moons.forEach((moon1, index1) => {
			moons.forEach((moon2, index2) => {
				if (index1 == index2) return;
				function updateVelocity(axis) {
					if (moon1.position[axis] < moon2.position[axis]) {
						moon1.velocity[axis]++;
						moon2.velocity[axis]--;
					}
				}
				updateVelocity("x");
				updateVelocity("y");
				updateVelocity("z");
			});
		});

		// Step 2: Position changes
		moons.forEach((moon) => {
			moon.position.x += moon.velocity.x;
			moon.position.y += moon.velocity.y;
			moon.position.z += moon.velocity.z;
		});
	}

	if (part === 1) {
		const iterationCount = isTest ? 100 : 1000;
		for (let i=0; i<iterationCount; i++) {
			timeStep();
		}

		return moons.reduce((acc, moon) => {
			const potential = (
				Math.abs(moon.velocity.x) +
				Math.abs(moon.velocity.y) +
				Math.abs(moon.velocity.z)
			);
			const kinetic = (
				Math.abs(moon.position.x) +
				Math.abs(moon.position.y) +
				Math.abs(moon.position.z)
			);
			return acc + (potential * kinetic);
		}, 0);
	}
};