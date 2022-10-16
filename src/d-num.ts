import {
  type RandomFloatFun,
  retrySym,
  randomInt,
  randomBirthDate,
  randomIndividualNumber,
  defaultRandomFloat,
  attempt,
  getFnumControlDigits,
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

  const [controlDigit1, controlDigit2] = getFnumControlDigits(digits);

  if (controlDigit1 === 10 || controlDigit2 === 10) {
    return retrySym;
  } else {
    return `${digits.join('')}${controlDigit1}${controlDigit2}`;
  }
}

export function dNum(args?: {
  randomFloat?: RandomFloatFun;
  startYear?: number;
  endYear?: number;
  gender?: 'f' | 'm';
}): string {
  const randomFloat = args?.randomFloat ?? defaultRandomFloat;
  const startYear = args?.startYear ?? 1854;
  const endYear = args?.endYear ?? 2039;
  const gender = args?.gender ?? randomInt(randomFloat, 1, 2) === 1 ? 'f' : 'm';
  return attempt(() => dNumInner({ endYear, gender, randomFloat, startYear }));
}
