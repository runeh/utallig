import {
  type RandomFloatFun,
  retrySym,
  randomInt,
  randomBirthDate,
  mod11,
  fNumControl1Weights,
  fNumControl2Weights,
  randomIndividualNumber,
  defaultRandomFloat,
} from './common';

function dNumInner(args: {
  randomFloat: RandomFloatFun;
  startYear: number;
  endYear: number;
  gender: 'f' | 'm';
}): string | typeof retrySym {
  const { endYear, gender, randomFloat, startYear } = args;
  const { day, month, year } = randomBirthDate({
    endYear,
    randomFloat,
    startYear,
  });
  const individualNum = randomIndividualNumber({ gender, randomFloat, year });

  const digits = [
    day.toString().padStart(2, '0'),
    month.toString().padStart(2, '0'),
    year.toString().slice(-2).padStart(2, '0'),
    individualNum.toString().padStart(3, '0'),
  ]
    .flatMap((e) => e.split(''))
    // add 4 to first digit of d-num
    .map((e, n) => (n === 0 ? Number(e) + 4 : e))
    .map((e) => Number(e));

  const control1 = mod11(fNumControl1Weights, digits);
  const control2 = mod11(fNumControl2Weights, [...digits, control1]);

  if (control1 === 10 || control2 === 10) {
    return retrySym;
  }

  return `${digits.join('')}${control1}${control2}`;
}

export function dNum(args: {
  randomFloat?: RandomFloatFun;
  startYear?: number;
  endYear?: number;
  gender?: 'f' | 'm';
}): string {
  const randomFloat = args.randomFloat ?? defaultRandomFloat;
  const startYear = args.startYear ?? 1854;
  const endYear = args.endYear ?? 2039;
  const gender = args.gender ?? randomInt(randomFloat, 1, 2) === 1 ? 'f' : 'm';

  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const res = dNumInner({
      endYear,
      gender,
      randomFloat,
      startYear,
    });
    if (res !== retrySym) {
      return res;
    }
  }
  throw new Error('Not able to find valid pnum in 100 attempts');
}
