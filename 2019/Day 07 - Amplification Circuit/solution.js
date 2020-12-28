const intcode = require("../intcode");

module.exports = (input, part) => {
	const program = input.split(",").map((val) => parseInt(val));
	let max = Number.MIN_SAFE_INTEGER;
	if (part === 1) {
		const phaseSettings = Array.permutations([0,1,2,3,4]);
		phaseSettings.forEach((phaseSetting) => {
			let signal = 0;
			phaseSetting.forEach((phase) => {
				const machine = intcode.run(program, [ phase, signal ]);
				signal = machine.output[0];
			});
			max = Math.max(signal, max);
		});
		return max;
	}
	else {
		const phaseSettings = Array.permutations([5,6,7,8,9]);
		phaseSettings.forEach((phaseSetting) => {
			const machines = [];
			let previousSignal = 0;
			while (
				(machines[4] == null) ||
				(machines[4].state === intcode.State.SUSPENDED)
			) {
				for (let i=0; i<5; i++) {
					if (machines[i] == null) {
						machines[i] = intcode.run(program, [phaseSetting[i], previousSignal]);
					}
					else {
						machines[i].input = [previousSignal];
						intcode.continueExecution(machines[i]);
					}
					previousSignal = machines[i].output[0];
				}
			}
			max = Math.max(machines[4].output[0], max);
		});
		return max;
	}
};