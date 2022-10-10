# utallig

Generate random but valid numbers used in Norwegian government and banking.
Useful for making mock data. The library will generate the following:

- [Organization numbers][orgnum] (orgNum) - 9 digit number identifying companies
  and organizations. Issued by [brreg][brreg].
- Bank accounts - 11 number digit identifying a bank account issued by a
  Norwegian bank.
- [Fødselesnummer][fnum] (fNum) - 11 digit ID number issued to Norwegian
  citizens.
- [d-nummer][dnum] (dNum) - 11 digit temporary ID number issued to people
  allowed to live and work in Norway.

**Caveat:** The generated numbers are random. Thus it's possible that a
generated number is in use by an individual or organization. No attempt is made
to avoid this, and there is not way to look up used personal numbers.

## Quick start

```
npm install utallig

# or

yarn install utallig
```

### Fødselsnummer and D-nummer:

The two functions work the same way and take the same arguments

```typescript
import { fNum, dNum } from 'utallig';

const someFNum = fNum();
const someDNum = fNum();

// A random fNum for a male person born between 1979 and 1980, inclusive.
const randomWithOptions = fNum({
  startYear: 1970,
  endYear: 1980,
  gender: 'm',
});
```

The functions take an options object with the following optional properties:

- `randomFloat` - RNG function
- `startYear` - The first allowed year to generate number for. The default is
  1854, the earliest allowed number in fødselsnummer and d-nummer.
- `endYear` - The last allowed year to number for. The default is 2049, the
  latest allowed number in fødselsnummer and d-nummer. In other words, by
  default you can get numbers for people not yet born.
- `gender` - The gender of the person. This is encoded into the number. By
  default a random gender is chosen. Valid options are `f` and `m`.

### Org number

```typescript
import { orgNum } from 'utallig';

const random = orgNum();
```

The `orgNum` function accepts an options object with the following optional
properties:

- `randomFloat` - RNG function
- `prefix` - A string of numbers that will be used as the first digit(s) of the
  generated org numbers. Useful to get a particular range of numbers.

### Account number

The `accountNum` function accepts an options object with the following optional
properties:

- `randomFloat` - RNG function
- `registerNumber` - A "registry number" for the bank. This is a 4 digit number
  that identifies the bank that has issued the account. See [the Norwegian BIC
  registry][bic] for the list of banks IDs.

### Controlling the random generator

By default, the library uses the `Math.random()` built-in function in
JavaScript. It's possible to pass in other random number generators. This can be
useful to generate predictable mock data by using a seedable random generator:

```typescript
import { fNum } from 'utallig';
import seedrandom from 'seedrandom';

const rng = seedrandom('my seed');
const random = fNum({ randomFloat: rng });
```

Every time this code runs, it generates the same random fNum.

The function passed in as the `randomFloat` parameter must function the same way
as the built int `Math.random` function. That is, it must be a function that
returns a floating point number between 0.0 and 1.0.

[orgnum]:
  https://www.brreg.no/om-oss/registrene-vare/om-enhetsregisteret/organisasjonsnummeret/
[brreg]: https://www.brreg.no
[dnum]:
  https://www.skatteetaten.no/person/utenlandsk/norsk-identitetsnummer/d-nummer/
[fnum]:
  https://www.skatteetaten.no/person/utenlandsk/norsk-identitetsnummer/fodselsnummer/
[bic]: https://www.bits.no/document/iban/
