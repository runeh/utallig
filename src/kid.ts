import { defaultRandomFloat, RandomFloatFun, randomInt, sum } from './common';

export type KidAlgorithm = 'mod10' | 'mod11';

export function mod10Kid(args: {
  randomFloat: RandomFloatFun;
  length?: number;
  prefix?: string;
}): string {
  const { randomFloat } = args;
  const prefix = args.prefix ?? '';
  let length = args.length ?? randomInt(randomFloat, 2, 25);

  if (prefix !== '') {
    if (prefix.length >= 24) {
      throw new Error('Prefix is too long');
    }

    length = randomInt(randomFloat, prefix.length + 1, 25);
  }

  const digits = Array.from({ length })
    .map(() => randomInt(randomFloat, 0, 9))
    .map((e, n) => prefix.charAt(n) || e)
    .map((e) => Number(e));

  const controlDigits = Array.from(digits)
    .reverse()
    .map((digit, index) => {
      if (index % 2 === 0) {
        const multiplied = digit * 2;
        return multiplied < 10 ? multiplied : multiplied - 9;
      } else {
        return digit;
      }
    });

  const controlSum = sum(controlDigits);
  const checkDigit = (10 - (controlSum % 10)) % 10;

  return [...digits, checkDigit].map((e) => e.toString()).join('');
}

export function kid(args: {
  randomFloat?: RandomFloatFun;
  algorithm?: KidAlgorithm;
  length?: number;
  prefix?: string;
}) {
  const randomFloat = args.randomFloat ?? defaultRandomFloat;
  return mod10Kid({ randomFloat, prefix: args.prefix });
}
