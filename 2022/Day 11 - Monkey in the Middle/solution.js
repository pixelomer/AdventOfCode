/** @type { (input: string, part: number, isTest: boolean) => any } */
module.exports = (input, part, isTest) => {
	input = input.split("\n\n");

	const monkeys = [];
	let mod = 1;
	for (let monkey of input) {
		monkey = monkey.split("\n");
		let num = +monkey[0].match(/(\d+)/)[1];
		let items = monkey[1].match(/: (.*)$/)[1].split(",").map((a) => +a);
		let operation = monkey[2].match(/: new \= (.*)$/)[1];
		let test = +monkey[3].match(/: divisible by (.*)$/)[1];
		mod *= test;
		let trueMonkey = +monkey[4].match(/: throw to monkey (\d+)$/)[1];
		let falseMonkey = +monkey[5].match(/: throw to monkey (\d+)$/)[1];
		monkeys[num] = { operation, items, test, trueMonkey, falseMonkey,
			inspected: 0 };
	}

	const rounds = (part === 2) ? 10000 : 20;

	for (let i=0; i<rounds; i++) {
		for (const monkey of monkeys) {
			for (let i=monkey.items.length-1; i>=0; i--) {
				let old = monkey.items[i];
				old = eval(monkey.operation);
				if (part === 1) {
					old = Math.floor(old / 3);
				}
				else {
					old %= mod;
				}
				if (old % monkey.test === 0) {
					monkeys[monkey.trueMonkey].items.push(old);
				}
				else {
					monkeys[monkey.falseMonkey].items.push(old);
				}
				monkey.items.pop();
				monkey.inspected++;
			}
		}
	}

	return [...monkeys].sort((a,b) => b.inspected - a.inspected).slice(0,2)
		.reduce((a,b) => a * b.inspected, 1);
};