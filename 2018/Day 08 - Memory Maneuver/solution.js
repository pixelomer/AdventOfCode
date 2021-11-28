const util = require('util');

class MemNode {
	size = 0;
	nodes = [];
	metadata = [];

	constructor(_data) {
		const data = [..._data];
		const read = (count) => {
			this.size += count;
			return data.splice(0, count);
		}
		let [childCount, metaCount] = read(2);
		while (childCount--) {
			const node = new MemNode(data);
			this.nodes.push(node);
			read(node.size);
		}
		this.metadata.push(...read(metaCount));
	}

	getMetadataSum() {
		let sum = 0;
		const sumNode = (node) => {
			sum += node.metadata.reduce((val, prev) => val + prev, 0);
			for (const child of node.nodes) {
				sumNode(child);
			}
		}
		sumNode(this);
		return sum;
	}

	getValue() {
		if (this.nodes.length === 0) {
			return this.getMetadataSum();
		}
		else {
			let sum = 0;
			for (const metadata of this.metadata) {
				const i = metadata - 1;
				if (this.nodes.length > i) {
					sum += this.nodes[i].getValue();
				}
			}
			return sum;
		}
	}
}

module.exports = (input, part) => {
	const root = new MemNode(input.split(' ').map((a) => +a));
	if (part === 1) {
		return root.getMetadataSum();
	}
	else {
		return root.getValue();
	}
};