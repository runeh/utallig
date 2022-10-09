import {
  type RandomFloatFun,
  retrySym,
  randomInt,
  randomBirthDate,
  mod11,
  fNumControl1Weights,
  fNumControl2Weights,
  randomIndividualNumber,
} from './common';

function innerFNum(args: {
  randomFloat: RandomFloatFun;
  startYear: number;
  endYear: number;
  gender: 'f' | 'm';
}): string | typeof retrySym {
  const randomFloat = args.randomFloat ?? (() => Math.random());
  const startYear = args.startYear ?? 1854;
  const endYear = args.endYear ?? 2039;
  const gender = args.gender ?? randomInt(randomFloat, 1, 2) === 1 ? 'f' : 'm';

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
    .map((e) => Number(e));

  const control1 = mod11(fNumControl1Weights, digits);
  const control2 = mod11(fNumControl2Weights, [...digits, control1]);

  if (control1 === 10 || control2 === 10) {
    return retrySym;
  }

  return `${digits.join('')}${control1}${control2}`;
}

export function fNum(args: {
  randomFloat?: RandomFloatFun;
  startYear?: number;
  endYear?: number;
  gender?: 'f' | 'm';
}): string {
  const randomFloat = args.randomFloat ?? (() => Math.random());
  const startYear = args.startYear ?? 1854;
  const endYear = args.endYear ?? 2039;
  const gender = args.gender ?? randomInt(randomFloat, 1, 2) === 1 ? 'f' : 'm';

  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const res = innerFNum({
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
