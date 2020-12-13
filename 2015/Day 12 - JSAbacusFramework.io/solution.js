module.exports = (input, part) => {
	if (part === 2) {
		function filter(object) {
			if (Array.isArray(object)) {
				// Array
				const newArray = new Array();
				object.forEach((item)=>{
					const newValue = filter(item);
					if (newValue != null) {
						newArray.push(newValue);
					}
				});
				return newArray;
			}
			else if (String.isString(object) || !isNaN(object)) {
				// String or number
				return object;
			}
			else {
				// Dictionary
				if (Object.values(object).includes("red")) {
					return null;
				}
				const newObject = {};
				Object.keys(object).forEach((key)=>{
					const newValue = filter(object[key]);
					if (newValue != null) {
						newObject[key] = newValue;
					}
				});
				return newObject;
			}
		}
		input = JSON.stringify(filter(JSON.parse(input)));
	}

	// There aren't any keys that contain numbers so this works
	return input.match(/-?[0-9]+/g).reduce((_, str) => _+parseInt(str), 0);
};