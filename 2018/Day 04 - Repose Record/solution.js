module.exports = (input, part) => {
	const logs = input.split('\n').map((line) => {
		const matches = line.match(/\[([0-9]+)-([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)\] (.*)/);
		return {
			year: +matches[1],
			month: +matches[2],
			day: +matches[3],
			hour: +matches[4],
			minute: +matches[5],
			data: matches[6]
		};
	}).sort((a, b) => {
		return (a.year - b.year) || (a.month - b.month) || (a.day - b.day) ||
			(a.hour - b.hour) || (a.minute - b.minute);
	});
	let prevLog = null;
	let guard = null;
	const times = {};
	const guards = {};
	for (const log of logs) {
		if ((match = log.data.match(/#([0-9]+)/))) {
			guard = +match[1];
		}
		else if (log.data.includes(" up")) {
			const previous = prevLog.minute + prevLog.hour * 60;
			const current = log.minute + log.hour * 60;
			for (let i = previous; i < current; i++) {
				if (i === 24 * 60) i = 0;
				if (times[i] == null) {
					times[i] = {};
				}
				times[i][guard] = (times[i][guard] ?? 0) + 1;
				guards[guard] = (guards[guard] ?? 0) + 1;
			}
		}
		prevLog = log;
	}
	if (part === 1) {
		guard = +Array.from(Object.entries(guards)).sort((a,b) => b[1]-a[1])[0][0];
		let mostAsleepTime = 0;
		let timesFallenAsleep = 0;
		for (const time in times) {
			const timeData = times[time]
			if (timeData[guard] > timesFallenAsleep) {
				mostAsleepTime = time;
				timesFallenAsleep = timeData[guard];
			}
		}
		return guard * (mostAsleepTime % 60);
	}
	else {
		let sleepyGuard = 0;
		let mostAsleepTime = 0;
		let timesFallenAsleep = 0;
		for (const time in times) {
			const timeData = times[time];
			const [guard, count] = Array.from(Object.entries(timeData)).sort((a,b) => b[1]-a[1])[0];
			if (count > timesFallenAsleep) {
				mostAsleepTime = time;
				timesFallenAsleep = count;
				sleepyGuard = guard;
			}
		}
		return sleepyGuard * (mostAsleepTime % 60);
	}
};