import {
  attempt,
  defaultRandomFloat,
  getMod11ControlDigit,
  getWeightedSum,
  RandomFloatFun,
  randomInt,
  retrySym,
  sum,
} from './common';

export type KidAlgorithm = 'mod10' | 'mod11';

function mod10Kid(args: {
  randomFloat: RandomFloatFun;
  length?: number;
  prefix: string;
}): string {
  const { prefix, randomFloat } = args;
  let length = args.length ? args.length - 1 : randomInt(randomFloat, 2, 25);

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

/**
 * Spec:
 * https://www.nets.eu/no-nb/PublishingImages/Lists/Accordion%20%20OCR%20giro/AllItems/OCR%20giro%20Systemspesifikasjon.pdf
 * The weights are 2,3,4,5,6,7, and then repeats from 2.
 * The weights are applied from right to left. So the last digit has the weight
 * 2.
 */
function mod11Weights(digits: number[]): number[] {
  return digits.map((_, n) => (n % 6) + 2).reverse();
}

function mod11Kid(args: {
  randomFloat: RandomFloatFun;
  length?: number;
  prefix: string;
}): string | typeof retrySym {
  const { randomFloat, prefix } = args;
  let length = args.length ? args.length - 1 : randomInt(randomFloat, 2, 25);

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

  const controlSum = getWeightedSum(digits, mod11Weights(digits));
  const control = getMod11ControlDigit(controlSum);

  if (control === 10) {
    return retrySym;
  } else {
    return [...digits, control].join('');
  }
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

  return attempt(() => {
    if (algorithm === 'mod10') {
      return mod10Kid({ prefix, randomFloat, length: args.length });
    } else {
      return mod11Kid({ prefix, randomFloat, length: args.length });
    }
  });
}
