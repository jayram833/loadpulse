import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        } catch (err) {
            console.warn(`Error reading localStorage key “${key}”:`, err);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const serialized = JSON.stringify(storedValue);
            window.localStorage.setItem(key, serialized);
        } catch (err) {
            console.warn(`Error setting localStorage key “${key}”:`, err);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
