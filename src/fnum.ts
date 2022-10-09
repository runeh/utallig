import {
  type RandomFloatFun,
  retrySym,
  getRandomInt,
  getBirthDate,
  mod11,
  pnumControl1Multipliers,
  pnumControl2Multipliers,
  getIndividualNumber,
} from './common';

function innerMakeRandomPnum(args: {
  randomFloat: RandomFloatFun;
  startYear: number;
  endYear: number;
  gender: 'f' | 'm';
}): string | typeof retrySym {
  const randomFloat = args.randomFloat ?? (() => Math.random());
  const startYear = args.startYear ?? 1854;
  const endYear = args.endYear ?? 2039;
  const gender =
    args.gender ?? getRandomInt(randomFloat, 1, 2) === 1 ? 'f' : 'm';

  const { day, month, year } = getBirthDate({
    endYear,
    randomFloat,
    startYear,
  });
  const individualNum = getIndividualNumber({ gender, randomFloat, year });

  const digits = [
    day.toString().padStart(2, '0'),
    month.toString().padStart(2, '0'),
    year.toString().slice(-2).padStart(2, '0'),
    individualNum.toString().padStart(3, '0'),
  ]
    .flatMap((e) => e.split(''))
    .map((e) => Number(e));

  const control1 = mod11(pnumControl1Multipliers, digits);
  const control2 = mod11(pnumControl2Multipliers, [...digits, control1]);

  if (control1 === 10 || control2 === 10) {
    return retrySym;
  }

  return `${digits.join('')}${control1}${control2}`;
}

export function makeRandomPnum(args: {
  randomFloat?: RandomFloatFun;
  startYear?: number;
  endYear?: number;
  gender?: 'f' | 'm';
}): string {
  const randomFloat = args.randomFloat ?? (() => Math.random());
  const startYear = args.startYear ?? 1854;
  const endYear = args.endYear ?? 2039;
  const gender =
    args.gender ?? getRandomInt(randomFloat, 1, 2) === 1 ? 'f' : 'm';

  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const res = innerMakeRandomPnum({
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
