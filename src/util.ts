export function avg(array: number[]) {
    return array.reduce((total, i) => total + i, 0);
}

export function dist(a: number[], b: number[]) {
    return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
}

export function midpoint(a: number[], b: number[]) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}
