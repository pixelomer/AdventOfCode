module.exports = (input, part, isTest) => {
	input = input.split("").map((a) => parseInt(a, 16).toString(2).padStart(4, "0")).join("");
	let offset = 0;

	function read(bitCount) {
		const substring = input.slice(offset, offset + bitCount);
		if ((input.length - offset) < bitCount) {
			throw new Error("Attempted to read out of bounds");
		}
		offset += bitCount;
		const result = parseInt(substring, 2);
		return result;
	}

	function readPacket() {
		let initialOffset = offset;
		const version = read(3);
		const type = read(3);
		const subpackets = [];
		let value;
		switch (type) {
			// Literal value packet
			case 4:
				let shouldContinue;
				value = 0;
				let str = "";
				do {
					shouldContinue = read(1) ? true : false;
					str += read(4).toString(2).padStart(4, "0");
				} while (shouldContinue);
				value = parseInt(str, 2);
				break;

			// Operator packet
			default:
				const lengthTypeId = read(1);
				if (lengthTypeId == 0) {
					let finalLength = read(15);
					let readLength = 0;
					while (readLength < finalLength) {
						const packet = readPacket();
						readLength += packet.size;
						subpackets.push(packet);
					}
				}
				else {
					let packetCount = read(11);
					for (let i=0; i<packetCount; i++) {
						const packet = readPacket();
						subpackets.push(packet);
					}
				}
				break;
		}
		const result = {
			type: type,
			size: (offset - initialOffset),
			subpackets: subpackets,
			version: version,
			value: value
		};
		if (result.value == null) {
			delete result.value;
		}
		return result;
	}

	const packet = readPacket();

	function versionSum(packet) {
		let sum = 0;
		for (const subpacket of packet.subpackets) {
			sum += versionSum(subpacket);
		}
		return sum + packet.version;
	}
	
	function calculate(packet) {
		const values = packet.subpackets.map((packet) => calculate(packet));
		let result;
		switch (packet.type) {
			case 0:
				result = 0;
				for (const value of values) {
					result += value;
				}
				break;
			case 1:
				result = 1;
				for (const value of values) {
					result *= value;
				}
				break;
			case 2:
				result = Math.min(...values);
				break;
			case 3:
				result = Math.max(...values);
				break;
			case 4:
				result = packet.value;
				break;
			case 5:
				result = (values[0] > values[1]) ? 1 : 0;
				break;
			case 6:
				result = (values[0] < values[1]) ? 1 : 0;
				break;
			case 7:
				result = (values[0] === values[1]) ? 1 : 0;
				break;
			default:
				throw new Error("Impossible type" + packet.type);
		}
		return result;
	}
	
	if (part === 1) {
		return versionSum(packet);
	}
	else {
		return calculate(packet);
	}
};