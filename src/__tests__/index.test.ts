import { fnr as fNumValidate, dnr as dNumValidate } from '@navikt/fnrvalidator';
import { fNum, dNum } from '../index';
import seedrandom from 'seedrandom';

const fuzzingRuns = 10000;

describe('pNum', () => {
  it(`Fuzzing ${fuzzingRuns} times`, () => {
    const rng = seedrandom('1');
    for (let n = 1; n < 10000; n++) {
      const num = fNum({ randomFloat: rng });
      expect(fNumValidate(num)).toEqual({ status: 'valid', type: 'fnr' });
    }
  });

  it.todo('Year out of range');
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
});
