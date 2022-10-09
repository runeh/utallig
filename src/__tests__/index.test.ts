import { fnr as validateFNum } from '@navikt/fnrvalidator';
import { fNum } from '../index';
import seedrandom from 'seedrandom';

describe('pNum', () => {
  it('Fuzzing', () => {
    const rng = seedrandom('1');
    for (let n = 1; n < 10000; n++) {
      const num = fNum({ randomFloat: rng });
      expect(validateFNum(num)).toEqual({ status: 'valid', type: 'fnr' });
    }
  });
});
