module.exports = (input, part, isTest) => {
	const WORKER_COUNT = isTest ? 2 : 5;
	const BASE_DURATION = isTest ? 0 : 60;

	input = input.split('\n');
	const relations = new Map();
	for (const line of input) {
		const match = line.match(/Step ([A-Z]+) must be finished before step ([A-Z]+) can begin/);
		const condition = match[1];
		const result = match[2];
		if (!relations.has(result)) {
			relations.set(result, []);
		}
		if (!relations.has(condition)) {
			relations.set(condition, []);
		}
		relations.get(result).push(condition);
	}

	function advanceConstruction(finishedPart) {
		if (finishedPart != null) {
			relations.delete(finishedPart);
		}
		const keys = Array.from(relations.keys());
		const possibilities = [];
		for (const key of keys) {
			const conditions = relations.get(key);
			const satisfied = conditions.every((val) => !relations.has(val));
			if (satisfied) {
				possibilities.push(key);
			}
		}
		possibilities.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
		return possibilities;
	}

	if (part === 1) {
		let order = "";
		let nextPart;
		while ((nextPart = advanceConstruction(nextPart)?.[0])) {
			order += nextPart;
		}
		return order;
	}
	else {
		const workers = [];
		relations.set("_", [ "_" ]);
		for (let i=0; i<WORKER_COUNT; i++) {
			workers.push({ job: null, timer: 0 });
		}
		let elapsedTime = -1;
		while (relations.size !== 1) {
			elapsedTime++;
			for (const worker of workers) {
				if (worker.job != null) {
					worker.timer++;
					if (worker.timer >= BASE_DURATION + worker.job.charCodeAt(0) - 0x40) {
						advanceConstruction(worker.job);
						worker.timer = 0;
						worker.job = null;
					}
				}
				if (worker.job == null) {
					const availableJob = advanceConstruction()?.[0];
					if (availableJob != null) {
						worker.timer = 0;
						worker.job = availableJob;
						relations.get(availableJob).push("_");
					}
				}
			}
		}
		return elapsedTime;
	}
};