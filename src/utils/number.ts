export function sum(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0);
}

export function percentage(percent: number, total: number) {
  return Math.floor((percent * 100) / total);
}
