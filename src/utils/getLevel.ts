export function getRandomXp(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getLevelXp(level: number) {
    return 100 * level;
}

export function getLevelPrestige(level: number) {
    return Math.floor((level || 1) / 25);
}
