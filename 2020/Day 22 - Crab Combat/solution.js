module.exports = (input, part) => {
	function playCombat(players, recursive = false) {
		let previousStates = new Set();
		players = [...players];
		let winningPlayer;
		while (!Object.values(players).some((array) => (array.length == 0))) {
			if (recursive) {
				const key = `${players[0].join(",")}|${players[1].join(",")}`;
				if (previousStates.has(key)) {
					winningPlayer = 0;
					break;
				}
				previousStates.add(key);
			}
			winningPlayer = 1;
			let newCards = [players[0].shift(), players[1].shift()];
			if (
				recursive
				&& (newCards[0] <= players[0].length)
				&& (newCards[1] <= players[1].length)
			) {
				const newPlayers = [
					players[0].slice(0, newCards[0]),
					players[1].slice(0, newCards[1])
				];
				winningPlayer = playCombat(newPlayers, true).winner;
			}
			else {
				if (newCards[0] > newCards[1]) {
					winningPlayer = 0;
				}
			}
			newCards = [newCards[winningPlayer], newCards[(winningPlayer == 1) ? 0 : 1]];
			players[winningPlayer].push(...newCards);
		}
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