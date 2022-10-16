import {
  defaultRandomFloat,
  getMod11ControlDigit,
  RandomFloatFun,
  randomInt,
  sum,
} from './common';

export type KidAlgorithm = 'mod10' | 'mod11';

export function mod10Kid(args: {
  randomFloat: RandomFloatFun;
  length?: number;
  prefix: string;
}): string {
  const { prefix, randomFloat } = args;
  let length = args.length ?? randomInt(randomFloat, 2, 25);

  // fixme: move this test to top level
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

export function mod11Kid(args: {
  randomFloat: RandomFloatFun;
  length?: number;
  prefix: string;
}): string {
  const { randomFloat, prefix } = args;
  let length = args.length ?? randomInt(randomFloat, 2, 25);

  // fixme: move this test to top level
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

  console.log('digs', digits);

  const controlSum = sum(digits);
  console.log('sum', controlSum);

  const control = getMod11ControlDigit(controlSum);
  return [...digits, control].join('');
}

export function kid(args: {
  randomFloat?: RandomFloatFun;
  algorithm?: KidAlgorithm;
  length?: number;
  prefix?: string;
}) {
  const randomFloat = args.randomFloat ?? defaultRandomFloat;
  const prefix = args.prefix ?? '';
  const algorithm: KidAlgorithm =
    args.algorithm ?? (randomFloat() > 0.5 ? 'mod10' : 'mod11');

  console.log('wut', algorithm, args.algorithm);
  if (algorithm === 'mod10') {
    return mod10Kid({ prefix, randomFloat, length: args.length });
  } else {
    return mod11Kid({ prefix, randomFloat, length: args.length });
  }
}

// http://www.pgrocer.net/Cis51/mod11.html
// bare ta lengden, gjør tingen og reverser?
