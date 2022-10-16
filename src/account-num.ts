import {
  type RandomFloatFun,
  retrySym,
  randomInt,
  attempt,
  defaultRandomFloat,
  getWeightedSum,
  getMod11ControlDigit,
} from './common';

const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

function innerMakeAccountNum(args: {
  randomFloat: RandomFloatFun;
  registerNumber?: number;
}): string | typeof retrySym {
  const { randomFloat, registerNumber } = args;
  const register = registerNumber ?? randomInt(randomFloat, 0, 9999);
  const accountGroup = randomInt(randomFloat, 0, 99);
  const customerNumber = randomInt(randomFloat, 0, 9999);
  const digits = [
    register.toString().padStart(4, '0'),
    accountGroup.toString().padStart(2, '0'),
    customerNumber.toString().padStart(4, '0'),
  ]
    .flatMap((e) => e.split(''))
    .map((e) => Number(e));

  const sum = getWeightedSum(digits, weights);
  const control = getMod11ControlDigit(sum);
  if (control === 10) {
    return retrySym;
  }
  return `${digits.join('')}${control}`;
}

export function accountNum(args?: {
  randomFloat: RandomFloatFun;
  registerNumber?: number;
}) {
  const registerNumber = args?.registerNumber;
  const randomFloat = args?.randomFloat ?? defaultRandomFloat;
  return attempt(() => innerMakeAccountNum({ registerNumber, randomFloat }));
}
