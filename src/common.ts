export type RandomFloatFun = typeof Math.random;
export const retrySym = Symbol('retry');
export const defaultRandomFloat = () => Math.random();

const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const fNumControl1Weights = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const fNumControl2Weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

// fixme: get rid of these.
const femaleDigits = [0, 2, 4, 6, 8];
const maleDigits = [1, 3, 5, 7, 9];

/**
 * Determine if a given year is a leap year. Based on this documentation:
 * From https://learn.microsoft.com/en-us/office/troubleshoot/excel/determine-a-leap-year
 */
export function getIsLeapYear(year: number) {
  return year % 4 === 0 && year % 100 === 0 && year % 400 === 0;
}

/**
 * Generate a random integer between `minInclusive` and `maxInclusive`. Uses
 * a random function that returns a float between 0 and 1 to do the work. Based
 * on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
 * @param randomFloat
 * @param minInclusive
 * @param maxInclusive
 * @returns
 */
export function randomInt(
  randomFloat: RandomFloatFun,
  minInclusive: number,
  maxInclusive: number,
) {
  const min = Math.ceil(minInclusive);
  const max = Math.floor(maxInclusive + 1);
  const value = randomFloat();
  if (value < 0 || value > 1) {
    throw new Error('Random generator returned value outside of range 0..1');
  }
  return Math.floor(value * (max - min) + min);
}

export function sum(digits: number[]): number {
  return digits.reduce((acc, cur) => acc + cur, 0);
}

export function getMod11ControlDigit(sum: number): number {
  const control = 11 - (sum % 11);
  return control === 11 ? 0 : control;
}

/**
 * For each digit, multiply it with the weight at the same index and return the
 * sum of all the multiplications.
 */
export function getWeightedSum(digits: number[], weights: number[]): number {
  if (digits.length !== weights.length) {
    throw new Error('weights and digits arrays must be the same length');
  }
  const multiplied = digits.map((num, index) => num * weights[index]!);
  return sum(multiplied);
}

export function getFnumControlDigits(
  digits: number[],
): [control1: number, control2: number] {
  const controlSum1 = getWeightedSum(digits, fNumControl1Weights);
  const controlDigit1 = getMod11ControlDigit(controlSum1);
  const controlSum2 = getWeightedSum(
    [...digits, controlDigit1],
    fNumControl2Weights,
  );
  const controlDigit2 = getMod11ControlDigit(controlSum2);
  return [controlDigit1, controlDigit2];
}

export function randomBirthDate(args: {
  randomFloat: RandomFloatFun;
  startYear: number;
  endYear: number;
}): { year: number; month: number; day: number } {
  const { endYear, randomFloat, startYear } = args;
  const year = randomInt(randomFloat, startYear, endYear);
  const month = randomInt(randomFloat, 1, 12);
  const isLeapYear = getIsLeapYear(year);

  const maxDay = month === 2 && isLeapYear ? 29 : daysInMonth[month];
  if (typeof maxDay !== 'number') {
    throw new Error('maxDay is not a number. This should never happen');
  }
  const day = randomInt(randomFloat, 1, maxDay);
  return { day, month, year };
}

export function randomIndividualNumber(args: {
  randomFloat: RandomFloatFun;
  year: number;
  gender: 'f' | 'm';
}): number {
  const { gender, randomFloat, year } = args;
  const [min, max] = individualNumberRange(year);
  const base = randomInt(randomFloat, min, max);
  const last =
    gender === 'f'
      ? femaleDigits[randomInt(randomFloat, 0, 4)]
      : maleDigits[randomInt(randomFloat, 0, 4)];
  if (typeof last !== 'number') {
    throw new Error('Invalid number of digits');
  }
  return base - (base % 10) + last;
}

/**
 * Get the allowed range for the "individual number" part of an f-num. The range
 * is determined by the birth year of the person whose number is being
 * generated.
 */
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

/**
 * Call the `fun` callback. As long as the callback returns `retrySym`, keep
 * retrying the call. If it returns any other value, return that value.
 * If no valid value was returned after trying the call `attempts` times, then
 * throw an error.
 * @param fun
 * @param attempts
 * @returns
 */
export function attempt<T>(fun: () => T | typeof retrySym, attempts = 100): T {
  let maxAttempts = Math.abs(attempts);
  while (maxAttempts-- > 0) {
    const ret = fun();
    if (ret !== retrySym) {
      return ret;
    }
  }
  throw new Error(`Not able to find legal value in ${attempts} attempts`);
}
