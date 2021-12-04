// Personal stats:
// [Part 1] 00:04:43, #221
// [Part 2] 00:17:37, #281

module.exports = (input, part) => {
	const passports = input.split("\n\n");
	let c = 0;
	const hairTypes = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
	passports.forEach((item)=>{
		const passport = item.split("\n").join(" ").split(" ");
		let array = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
		passport.forEach((pair)=>{
			const key = pair.split(":")[0];
			const value = pair.split(":")[1];
			if (part === 2) {
				const valueInt = parseInt(value);
				if ((key === "byr") && ((valueInt < 1920) || (valueInt > 2002))) {
					return;
				}
				if ((key === "iyr") && ((valueInt < 2010) || (valueInt > 2020))) {
					return;
				}
				else if ((key === "eyr") && ((valueInt < 2020) || (valueInt > 2030))) {
					return;
				}
				else if (key === "hgt") {
					const number = parseInt(value.match(/^[0-9]+/g) ?? "0");
					if (value.endsWith("cm") && ((number < 150) || (number > 193))) {
						return;
					}
					else if (value.endsWith("in") && ((number < 59) || (number > 76))) {
						return;
					}
					if (!value.endsWith("in") && !value.endsWith("cm")) return;
				}
				else if ((key === "hcl") && !value.match(/^\#[0-9a-fA-F]{6}$/g)) {
					return;
				}
				else if ((key === "ecl") && !hairTypes.includes(value)) {
					return;
				}
				else if ((key === "pid") && !value.match(/^[0-9]{9}$/g)) {
					return;
				}
			}
			array = array.filter((item)=>{
				return item !== key;
			});
		});
		if (array.length === 0) c++;
	});
	return c;
};