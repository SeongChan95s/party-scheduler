import { useEffect, useState } from 'react';

function parseStorageValue<T>(value: string | null): T | null {
	if (value === null) {
		return null;
	}

	try {
		return JSON.parse(value) as T;
	} catch {
		return value as T;
	}
}

export function useLocalStorage<T>(key: string) {
	const [localStorageItem, setLocalStorageItem] = useState<T | null>(() => {
		const item = localStorage.getItem(key);
		return parseStorageValue<T>(item);
	});

	useEffect(() => {
		const item = localStorage.getItem(key);
		const parsed = parseStorageValue<T>(item);
		setLocalStorageItem(parsed);
	}, [key]);

	const get = () => {
		return localStorageItem;
	};

	const set = (value: T) => {
		setLocalStorageItem(value);
		const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
		localStorage.setItem(key, valueToStore);
	};

	const push = (value: T extends Array<infer U> ? U : never) => {
		if (localStorageItem && Array.isArray(localStorageItem)) {
			const newArray = [...localStorageItem, value];
			setLocalStorageItem(newArray as T);
			localStorage.setItem(key, JSON.stringify(newArray));
		}
	};

	return { get, set, push };
}
