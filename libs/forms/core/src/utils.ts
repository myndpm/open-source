// customized yeikos/js.merge

export function merge(clone: boolean, ...items: any[]): any
export function merge(...items: any[]): any
export function merge(...items: any[]) {
	return _merge(items[0] === true, false, items);
}

export function recursive(clone: boolean, ...items: any[]): any
export function recursive(...items: any[]): any
export function recursive(...items: any[]) {
	return _merge(items[0] === true, true, items);
}

export function clone<T>(input: T): T {
	if (Array.isArray(input)) {
    return input.map(clone) as any;

	} else if (isObject(input)) {
    if (input instanceof Map || input instanceof Set) {
      // treated as an abstract data type
      return input;
    }

		const output: any = {};
		for (let index in input) {
			output[index] = clone(input[index]);
    }
		return output as any;

	} else {
		return input;
	}
}

export function isObject(input: any): input is Object {
	return input && typeof input === 'object' && !Array.isArray(input)
}

function _recursiveMerge(base: any, extend: any) {
	if (!isObject(base))
		return extend

	for (const key in extend) {
		if (['__proto__', 'constructor', 'prototype', 'toString', 'hasOwnProperty'].includes(key)) {
      continue;
    }
		base[key] = (isObject(base[key]) && isObject(extend[key]))
      ? _recursiveMerge(base[key], extend[key])
      : extend[key];
	}

	return base

}

function _merge(isClone: boolean, isRecursive: boolean, items: any[]) {
	let result
	if (isClone || !isObject(result = items.shift())) {
		result = {}
  }

	for (let index = 0; index < items.length; ++index) {
		const item = items[index];

		if (!isObject(item)) {
			continue;
    }

		for (const key in item) {
			if (['__proto__', 'constructor', 'prototype', 'toString', 'hasOwnProperty'].includes(key)) {
        continue;
      }
			const value = isClone ? clone(item[key]) : item[key];
			result[key] = isRecursive ? _recursiveMerge(result[key], value) : value;
		}
	}

	return result
}
