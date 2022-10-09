export type RandomFloatFun = typeof Math.random;

const retrySym = Symbol('retry');
const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const femaleDigits = [0, 2, 4, 6, 8];
const maleDigits = [1, 3, 5, 7, 9];
const pnumControl1Multipliers = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const pnumControl2Multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

// From https://learn.microsoft.com/en-us/office/troubleshoot/excel/determine-a-leap-year
function getIsLeapYear(year: number) {
  return year % 4 === 0 && year % 100 === 0 && year % 400 === 0;
}

// From
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(
  randomFloat: RandomFloatFun,
  minInclusive: number,
  maxInclusive: number,
) {
  const min = Math.ceil(minInclusive);
  const max = Math.floor(maxInclusive + 1);
  return Math.floor(randomFloat() * (max - min) + min);
}

function individualNumberRange(year: number): [min: number, max: number] {
  if (year >= 1854 && year <= 1899) {
    return [500, 749];
  } else if (year >= 1900 && year <= 1999) {
    return [0, 499];
  } else if (year >= 2000 && year <= 2049) {
    return [500, 999];
  } else {
    throw new Error(`Could not find number for year ${year}`);
  }
}

function getIndividualNumber(args: {
  randomFloat: RandomFloatFun;
  year: number;
  gender: 'f' | 'm';
}): number {
  const { gender, randomFloat, year } = args;
  const [min, max] = individualNumberRange(year);
  const base = getRandomInt(randomFloat, min, max);
  const last =
    gender === 'f'
      ? femaleDigits[getRandomInt(randomFloat, 0, 4)]
      : maleDigits[getRandomInt(randomFloat, 0, 4)];
  if (typeof last !== 'number') {
    throw new Error('Invalid number of digits');
  }
  return base - (base % 10) + last;
}

function getBirthDate(args: {
  randomFloat: RandomFloatFun;
  startYear: number;
  endYear: number;
}): { year: number; month: number; day: number } {
  const { endYear, randomFloat, startYear } = args;
  const year = getRandomInt(randomFloat, startYear, endYear);
  const month = getRandomInt(randomFloat, 1, 12);
  const isLeapYear = getIsLeapYear(year);

  const maxDay = month === 2 && isLeapYear ? 29 : daysInMonth[month];
  if (typeof maxDay !== 'number') {
    throw new Error('maxDay is not a number. This should never happen');
  }
  const day = getRandomInt(randomFloat, 1, maxDay);
  return { day, month, year };
}

function mod11(weights: number[], digits: number[]) {
  const sum = weights.reduce((acc, cur, index) => {
    const num = digits[index];
    if (typeof num !== 'number') {
      throw new Error('Mismatch between length of number and weights');
    }
    return acc + cur * num;
  }, 0);

  const control = 11 - (sum % 11);
  return control === 11 ? 0 : control;
}

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

function innerMakeRandomBankAccount(args: {
  randomFloat: RandomFloatFun;
  registerNumber?: number;
}): string | typeof retrySym {
  const { randomFloat, registerNumber } = args;
  const register = registerNumber ?? getRandomInt(randomFloat, 0, 9999);
  const accountGroup = getRandomInt(randomFloat, 0, 99);
  const customerNumber = getRandomInt(randomFloat, 0, 9999);
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
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

export function makeRandomOrgNum(args?: {
  randomFloat?: RandomFloatFun;
  prefix: string;
}): string {
  const randomFloat = args?.randomFloat ?? (() => Math.random());
  const prefix = args?.prefix ?? '';
  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const orgNum = getRandomInt(randomFloat, 0, 99_999_999);
    const digits = orgNum
      .toString()
      .padStart(8, '0')
      .split('')
      .map((e, n) => prefix.charAt(n) || e)
      .map((e) => Number(e));

    const control = mod11([3, 2, 7, 6, 5, 4, 3, 2], digits);
    if (control !== 10) {
      return [...digits, control].join('');
    }
  }
  throw new Error('Not able to find valid org num in 100 attempts');
}
