import { fnr } from '@navikt/fnrvalidator';
import { makeRandomPnum } from '../index';
import seedrandom from 'seedrandom';

describe('pNum', () => {
  it('Fuzzing', () => {
    const rng = seedrandom('1');
    for (let n = 1; n < 10000; n++) {
      const num = makeRandomPnum({ randomFloat: rng });
      expect(fnr(num)).toEqual({ status: 'valid', type: 'fnr' });
    }
  });
});
