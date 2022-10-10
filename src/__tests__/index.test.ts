import { fnr as fNumValidate, dnr as dNumValidate } from '@navikt/fnrvalidator';
import { fNum, dNum, orgNum, accountNum } from '../index';
import norVal from 'norsk-validator';
import seedrandom from 'seedrandom';

const fuzzingRuns = 10000;

/**
 * Call fun a bunch of times
 * @param fun
 * @param times
 */
function repeat(fun: () => unknown, times = 10_000) {
  for (let n = 0; n < times; n++) {
    fun();
  }
}

describe('orgNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const randomFloat = seedrandom('1');

    for (let n = 1; n < 10000; n++) {
      const num = orgNum({ randomFloat });
      expect(norVal.organisasjonsnummer(num)).toEqual(true);
    }
  });

  it('Allows prefix', () => {
    const randomFloat = seedrandom('1');

    const orgNum1 = orgNum({ randomFloat, prefix: '9' });
    expect(orgNum1).toEqual('934408780');
    expect(norVal.organisasjonsnummer(orgNum1)).toEqual(true);

    const orgNum2 = orgNum({ randomFloat, prefix: '11' });
    expect(orgNum2).toEqual('114077933');
    expect(norVal.organisasjonsnummer(orgNum2)).toEqual(true);
  });
});

describe('accountNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const randomFloat = seedrandom('1');

    repeat(() => {
      const num = accountNum({ randomFloat });
      expect(norVal.kontonummer(num)).toEqual(true);
    });
  });
  it.todo('registerNumber');
});

describe('fNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const randomFloat = seedrandom('1');

    repeat(() => {
      const num = fNum({ randomFloat });
      expect(fNumValidate(num)).toEqual({ status: 'valid', type: 'fnr' });
    });
  });

  it(`Bails if year argument is out of range`, () => {
    expect(() =>
      fNum({ startYear: 1600, endYear: 1600 }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find number for year 1600"`,
    );
  });

  it(`Gender distributions seem reasonable`, () => {
    const randomFloat = seedrandom('2');
    const genderCounts = { f: 0, m: 0 };

    repeat(() => {
      const num = fNum({ randomFloat });
      const genderDigit = num.charAt(8);
      const gender = Number(genderDigit) % 2 === 0 ? 'f' : 'm';
      genderCounts[gender]++;
    });
    expect(genderCounts).toMatchInlineSnapshot(`
{
  "f": 5012,
  "m": 4988,
}
`);
  });

  it(`Year distributions seem reasonable`, () => {
    const randomFloat = seedrandom('3');
    const yearCounts: Record<string, number> = {};

    repeat(() => {
      const num = fNum({ randomFloat, startYear: 1970, endYear: 1979 });
      const year = num.slice(4, 6);
      if (yearCounts[year]) {
        yearCounts[year]++;
      } else {
        yearCounts[year] = 1;
      }
    });

    expect(yearCounts).toMatchInlineSnapshot(`
{
  "70": 985,
  "71": 1005,
  "72": 1050,
  "73": 1048,
  "74": 937,
  "75": 964,
  "76": 1023,
  "77": 967,
  "78": 1013,
  "79": 1008,
}
`);
  });

  it.todo('parameters');
});

describe('dNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const randomFloat = seedrandom('1');
    repeat(() => {
      const num = dNum({ randomFloat });
      expect(dNumValidate(num)).toEqual({ status: 'valid', type: 'dnr' });
    });
  });

  it(`Bails if year argument is out of range`, () => {
    expect(() =>
      dNum({ startYear: 1600, endYear: 1600 }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find number for year 1600"`,
    );

    expect(() =>
      dNum({ startYear: 2200, endYear: 2200 }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find number for year 2200"`,
    );
  });

  it.todo('parameters');
});
