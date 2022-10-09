export type Range = [min: number, max: number];
export type RandomIntFun = (min: number, max: number) => number;

const retrySym = Symbol('retry');
const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const femaleDigits = [0, 2, 4, 6, 8];
const maleDigits = [1, 3, 5, 7, 9];
const pnumControl1Multipliers = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const pnumControl2Multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

// From
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(minInclusive: number, maxInclusive: number) {
  const min = Math.ceil(minInclusive);
  const max = Math.floor(maxInclusive + 1);
  return Math.floor(Math.random() * (max - min) + min);
}

function individualNumRange(year: number): Range {
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

function getIndNum(args: {
  randomInt: RandomIntFun;
  year: number;
  gender: 'f' | 'm';
}): number {
  const { gender, randomInt: randomInt, year } = args;
  const [min, max] = individualNumRange(year);
  const base = randomInt(min, max);
  const last =
    gender === 'f'
      ? femaleDigits[randomInt(0, 4)]
      : maleDigits[randomInt(0, 4)];
  if (typeof last !== 'number') {
    throw new Error('asdf');
  }
  return base - (base % 10) + last;
}

function getBirthDate(args: {
  randomInt: RandomIntFun;
  startYear: number;
  endYear: number;
}): { year: number; month: number; day: number } {
  const { endYear, randomInt: randomInt, startYear } = args;
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12);
  // From https://learn.microsoft.com/en-us/office/troubleshoot/excel/determine-a-leap-year
  const isLeapYear = year % 4 === 0 && year % 100 === 0 && year % 400 === 0;
  const maxDay = month === 2 && isLeapYear ? 29 : daysInMonth[month];
  if (typeof maxDay !== 'number') {
    throw new Error('maxDay is not a number. This should never happen');
  }
  const day = randomInt(1, maxDay);
  return { day, month, year };
}

function mod11(weights: number[], digits: number[]) {
  const sum = weights.reduce((acc, cur, index) => {
    const num = digits[index];
    if (typeof num !== 'number') {
      throw new Error('asdf');
    }
    return acc + cur * num;
  }, 0);

  const control = 11 - (sum % 11);
  return control === 11 ? 0 : control;
}

function innerMakeRandomPnum(args: {
  randomInt: RandomIntFun;
  startYear: number;
  endYear: number;
  gender: 'f' | 'm';
}): string | typeof retrySym {
  const randomInt = args.randomInt ?? getRandomInt;
  const startYear = args.startYear ?? 1854;
  const endYear = args.endYear ?? 2039;
  const gender = args.gender ?? randomInt(1, 2) === 1 ? 'f' : 'm';

  const { day, month, year } = getBirthDate({
    startYear,
    endYear,
    randomInt,
  });
  const individualNum = getIndNum({ gender, randomInt, year });

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
  randomInt?: RandomIntFun;
  startYear?: number;
  endYear?: number;
  gender?: 'f' | 'm';
}): string {
  const randomInt = args.randomInt ?? getRandomInt;
  const startYear = args.startYear ?? 1854;
  const endYear = args.endYear ?? 2039;
  const gender = args.gender ?? randomInt(1, 2) === 1 ? 'f' : 'm';

  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const res = innerMakeRandomPnum({
      endYear,
      gender,
      randomInt,
      startYear,
    });
    if (res !== retrySym) {
      return res;
    }
  }
  throw new Error('Not able to find valid pnum in 100 attempts');
}

function innerMakeRandomBankAccount(args: {
  randomInt: RandomIntFun;
  registerNumber?: number;
}): string | typeof retrySym {
  const { randomInt, registerNumber } = args;
  const register = registerNumber ?? randomInt(0, 9999);
  const accountGroup = randomInt(0, 99);
  const customerNumber = randomInt(0, 9999);
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

export function makeRandomBankAccount(args: {
  randomInt?: RandomIntFun;
  registerNumber?: number;
}) {
  const { registerNumber } = args;
  const randomInt = args.randomInt ?? getRandomInt;

  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const res = innerMakeRandomBankAccount({ registerNumber, randomInt });
    if (res !== retrySym) {
      return res;
    }
  }
  throw new Error('Not able to find valid bank account in 100 attempts');
}

export function makeRandomOrgNum(
  randomInt?: RandomIntFun,
  options?: { prefix: string },
): string {
  randomInt = randomInt ?? getRandomInt;
  const prefix = options?.prefix ?? '';
  let maxAttempts = 100;
  while (maxAttempts-- > 0) {
    const orgNum = randomInt(0, 99_999_999);
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
