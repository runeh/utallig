import { type RandomFloatFun, retrySym, randomInt, mod11 } from './common';

const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

function innerMakeRandomBankAccount(args: {
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
  const control = mod11(weights, digits);
  if (control === 10) {
    return retrySym;
  }
  return `${digits.join('')}${control}`;
}

export function makeRandomBankAccount(args?: {
  randomFloat: RandomFloatFun;
  registerNumber?: number;
}) {
  const registerNumber = args?.registerNumber;
  const randomFloat = args?.randomFloat ?? (() => Math.random());

  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const res = innerMakeRandomBankAccount({ registerNumber, randomFloat });
    if (res !== retrySym) {
      return res;
    }
  }
  throw new Error('Not able to find valid bank account in 100 attempts');
}
