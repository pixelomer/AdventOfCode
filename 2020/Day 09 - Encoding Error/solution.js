module.exports = (input, part) => {
	let array = new Array();
	const split = input.split("\n");
	let invalidNumber = 0;
	for (let i=0; i<split.length; i++) {
		let num = parseInt(split[i]);
		if (array.length < 25) {
			array.push(num);
			continue;
		}
		if ((()=>{
			let begin = array.length - 25;
			for (let j=begin; j<array.length; j++) {
				for (let k=begin; k<array.length; k++) {
					if (j == k) continue;
					if ((array[j] + array[k]) == num) {
						return true;
					}
				}
			}
			return false;
		})()) {
			array.push(num);
		}
		else {
			invalidNumber = num;
			if (part === 1) {
				return invalidNumber;
			}
			break;
		}
	}
	for (let i=0; i<array.length; i++) {
		let sum = 0;
		const nums = new Array();
		for (let j=i; j<array.length; j++) {
			sum += array[j];
			nums.push(array[j]);
			if (sum >= invalidNumber) {
				break;
			}
		}
		if (sum != invalidNumber) {
			continue;
		}
		let smallest = Number.MAX_SAFE_INTEGER;
		let largest = 0;
		nums.forEach((item)=>{
			smallest = Math.min(smallest, item);
			largest = Math.max(largest, item);
		});
		return smallest + largest;
	}
}