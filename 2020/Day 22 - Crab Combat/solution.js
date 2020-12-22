module.exports = (input, part) => {
	console.log = ()=>{}; // comment to make verbose

	function playCombat(players, recursive = false, ID = 1) {
		console.log(`=== Game ${ID} ===\n`);
		let previousStates = {};
		let round = 1;
		players = [...players];
		let winningPlayer;
		while (!Object.values(players).some((array) => (array.length == 0))) {
			if (recursive) {
				const key = `${players[0].join(",")}|${players[1].join(",")}`;
				if (previousStates[key]) {
					winningPlayer = 0;
					break;
				}
				previousStates[key] = true;
			}
			winningPlayer = 1;
			console.log(
`-- Round ${round} (Game ${ID}) --
Player 1's deck: ${players[0].join(", ")}
Player 2's deck: ${players[1].join(", ")}`);
			let newCards = [players[0].shift(), players[1].shift()];
			console.log(
`Player 1 plays: ${newCards[0]}
Player 2 plays: ${newCards[1]}`);
			if (
				recursive
				&& (newCards[0] <= players[0].length)
				&& (newCards[1] <= players[1].length)
			) {
				const newPlayers = [
					players[0].slice(0, newCards[0]),
					players[1].slice(0, newCards[1])
				];
				console.log("Playing a sub-game to determine the winner...\n");
				winningPlayer = playCombat(newPlayers, true, ID+1).winner;
				console.log("...anyway, back to game ");
			}
			else {
				if (newCards[0] > newCards[1]) {
					winningPlayer = 0;
				}
			}
			newCards = [newCards[winningPlayer], newCards[(winningPlayer == 1) ? 0 : 1]];
			console.log(`Player ${winningPlayer+1} wins round ${round++} of game ${ID}!\n`);
			players[winningPlayer].push(...newCards);
		}
		console.log(`The winner of game ${ID} is ${winningPlayer}!\n`);
		return {
			winner: winningPlayer,
			winnerScore: players[winningPlayer].reduce((acc, card, index) =>
				(acc + ((players[winningPlayer].length - index) * card)), 0),
			finalState: players
		};
	}

	const players = input.split("\n\n").reduce((acc, item) => {
		item = item.split("\n");
		acc.push(item.slice(1).map((val) => parseInt(val)));
		return acc;
	}, []);

	if (players.length != 2) {
		console.log("Input must contain exactly 2 players.");
		return null;
	}

	return playCombat(players, (part === 2)).winnerScore;
};