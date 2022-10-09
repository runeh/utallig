import {
  type RandomFloatFun,
  randomInt,
  attempt,
  retrySym,
  getWeightedSum,
  getMod11ControlDigit,
} from './common';

const weights = [3, 2, 7, 6, 5, 4, 3, 2];

export function orgNum(args?: {
  randomFloat?: RandomFloatFun;
  prefix?: string;
}): string {
  const randomFloat = args?.randomFloat ?? (() => Math.random());
  const prefix = args?.prefix ?? '';
  return attempt(() => {
    const orgNum = randomInt(randomFloat, 0, 99_999_999);
    const digits = orgNum
      .toString()
      .padStart(8, '0')
      .split('')
      .map((e, n) => prefix.charAt(n) || e)
      .map((e) => Number(e));
    const sum = getWeightedSum(digits, weights);
    const control = getMod11ControlDigit(sum);
    return control !== 10 ? [...digits, control].join('') : retrySym;
  });
}
