// This solution uses Dijkstra's algorithm.
// See: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm

class LinkedList {
	// The head stays constant and its value is always null
	head = { next: null, prev: null, value: null };
	length = 0;
	
	constructor(source) {
		if (source == null) {
			return;
		}
		let lastNode = this.head;
		for (const value of source) {
			lastNode = this.insertAfter(lastNode, value);
		}
	}

	*[Symbol.iterator]() {
		let node = this.head.next;
		while (node != null) {
			yield node;
			node = node.next;
		};
	}

	insert(value) {
		return this.insertAfter(this.head, value);
	}

	insertAfter(node, value) {
		this.length++;
		const newNode = { next: node.next, prev: node, value: value };
		if (node.next != null) {
			node.next.prev = newNode;
		}
		node.next = newNode;
		return newNode;
	}

	remove(node) {
		this.length--;
		node.prev.next = node.next;
		if (node.next != null) {
			node.next.prev = node.prev;
		}
	}
}

module.exports = (input, part) => {
	const map = input.split("\n").map((a) => a.split("").map((a) => +a));

	const multiplier = (part === 1) ? 1 : 5;
	const mapWidth = map[0].length;
	const mapHeight = map.length;
	const realWidth = mapWidth * multiplier;
	const realHeight = mapHeight * multiplier;

	function getRisk(x,y) {
		const change = Math.floor(x / mapWidth) + Math.floor(y / mapHeight);
		x %= mapWidth;
		y %= mapHeight;
		return (map[y][x] - 1 + change) % 9 + 1;
	}

	const nodes = new Array();

	function getNodeIndex(x, y) {
		return (
			((x < realWidth) && (y < realHeight) && (x >= 0) && (y >= 0)) ?
			((y * realHeight) + x)
			: -1
		);
	}

	function getNode(x, y) {
		const index = getNodeIndex(x, y);
		if (index === -1) {
			return null;
		}
		if (nodes[index] === undefined) {
			nodes[index] = {
				distance: Number.MAX_SAFE_INTEGER,
				length: getRisk(x, y),
				visited: false,
				previous: null,
				x: x,
				y: y
			};
		}
		return nodes[index] ?? null;
	}

	const unvisited = new LinkedList();

	let node = getNode(0, 0);
	node.distance = 0;
	const destination = getNode(realWidth-1, realHeight-1);
	let i=0;
	while (!destination.visited) {
		// Advance pathfinder
		const {x,y} = node;
		for (const [nx,ny] of [[x, y+1], [x, y-1], [x+1, y], [x-1, y]]) {
			const neighbour = getNode(nx, ny);
			if ((neighbour == null) || neighbour.visited) {
				continue;
			}
			const newDistance = node.distance + neighbour.length;
			if (newDistance < neighbour.distance) {
				neighbour.distance = newDistance;
				neighbour.previous = node;

				// Move neighbour to the beginning of the linked list
				if (neighbour.listItem != null) {
					unvisited.remove(neighbour.listItem);
				}
				neighbour.listItem = unvisited.insert(neighbour);
			}
		}

		// Mark node as visited
		node.visited = true;

		// Remove node from the linked list
		if (node.listItem != null) {
			unvisited.remove(node.listItem);
		}

		// Get rid of the old node entirely as it is no longer needed
		nodes[getNodeIndex(x, y)] = null;

		// Find a new node
		let newNode;
		for (const listItem of unvisited) {
			const node = listItem.value;
			if ((newNode == null) || (node.distance < newNode.distance)) {
				newNode = node;
			}
			if (node.distance === Number.MAX_SAFE_INTEGER) {
				break;
			}
		}

		node = newNode;
	}

	return destination.distance;
};