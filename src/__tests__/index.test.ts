import { fnr as fNumValidate, dnr as dNumValidate } from '@navikt/fnrvalidator';
import { fNum, dNum, orgNum, accountNum } from '../index';
import norVal from 'norsk-validator';
import seedrandom from 'seedrandom';

const fuzzingRuns = 10000;

describe('orgNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const rng = seedrandom('1');
    for (let n = 1; n < 10000; n++) {
      const num = orgNum({ randomFloat: rng });
      expect(norVal.organisasjonsnummer(num)).toEqual(true);
    }
  });
  it.todo('prefix');
});

describe('accountNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const rng = seedrandom('1');
    for (let n = 1; n < 10000; n++) {
      const num = accountNum({ randomFloat: rng });
      expect(norVal.kontonummer(num)).toEqual(true);
    }
  });
  it.todo('registerNumber');
});

describe('pNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const rng = seedrandom('1');
    for (let n = 1; n < 10000; n++) {
      const num = fNum({ randomFloat: rng });
      expect(fNumValidate(num)).toEqual({ status: 'valid', type: 'fnr' });
    }
  });

  it.todo('Year out of range');
  it.todo('parameters');
});

describe('dNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const rng = seedrandom('1');
    for (let n = 1; n < 10000; n++) {
      const num = dNum({ randomFloat: rng });
      expect(dNumValidate(num)).toEqual({ status: 'valid', type: 'dnr' });
    }
  });

  it.todo('Year out of range');
  it.todo('parameters');
});
