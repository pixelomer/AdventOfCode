module.exports = (input, part) => {
	const descriptions = input.split("\n");
	const reindeers = new Array(descriptions.length);
	descriptions.forEach((line)=>{
		const match = line.match(/^([A-Za-z]+) can fly ([0-9]+) km\/s for ([0-9]+) seconds, but then must rest for ([0-9]+) seconds\.$/);
		reindeers.push({
			name: match[1],
			kmPerSec: parseInt(match[2]),
			flyFor: parseInt(match[3]),
			restFor: parseInt(match[4])
		});
	});
	const time = 2503;
	let longestDistance = 0;

	function advance(state) {
		reindeers.forEach((reindeer)=>{
			const reindeerState = state[reindeer.name];
			if (!reindeerState.isResting) {
				reindeerState.distance += reindeer.kmPerSec;
			}
			reindeerState.timeRemaining--;
			if (reindeerState.timeRemaining == 0) {
				reindeerState.isResting = !reindeerState.isResting;
				reindeerState.timeRemaining = (
					reindeerState.isResting ?
					reindeer.restFor :
					reindeer.flyFor
				);
			}
		});
		let leaders = [
			{ distance: 0 }
		];
		reindeers.forEach((reindeer)=>{
			if (state[reindeer.name].distance > leaders[0].distance) {
				leaders = [
					state[reindeer.name]
				];
			}
			else if (state[reindeer.name].distance == leaders[0].distance) {
				leaders.push(state[reindeer.name]);
			}
		});
		leaders.forEach((leader)=>{
			leader.points++;
		});
	}

	const state = {};

	reindeers.forEach((reindeer)=>{
		state[reindeer.name] = {
			distance: 0,
			points: 0,
			isResting: false,
			timeRemaining: reindeer.flyFor
		};
	});

	for (let i=0; i<2503; i++) {
		advance(state);
	}

	//console.error(state);

	let answer = 0;
	Object.values(state).forEach((state)=>{
		answer = Math.max(answer, ((part === 1) ? state.distance : state.points));
	});

	return answer;
};