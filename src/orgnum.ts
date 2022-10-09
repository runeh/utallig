import { type RandomFloatFun, getRandomInt, mod11 } from './common';

const weights = [3, 2, 7, 6, 5, 4, 3, 2];

export function makeRandomOrgNum(args?: {
  randomFloat?: RandomFloatFun;
  prefix: string;
}): string {
  const randomFloat = args?.randomFloat ?? (() => Math.random());
  const prefix = args?.prefix ?? '';
  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const orgNum = getRandomInt(randomFloat, 0, 99_999_999);
    const digits = orgNum
      .toString()
      .padStart(8, '0')
      .split('')
      .map((e, n) => prefix.charAt(n) || e)
      .map((e) => Number(e));

    const control = mod11(weights, digits);
    if (control !== 10) {
      return [...digits, control].join('');
    }
  }
  throw new Error('Not able to find valid org num in 100 attempts');
}
