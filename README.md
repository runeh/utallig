# utallig

Generate random but valid numbers used in Norwegian govenrment and banking.
Useful for making mock data. The library will generate the following:

- [Organization numbers][orgnum] (orgNum) - 9 digit number identifying companies
  and organizations. Issued by [brreg][brreg].
- Bank accounts - 11 number digit identifying a bank account in a Norwegian
  bank.
- [Fødselesnummer][fnum] (fNum) - 11 number digit issued to Norwegian citizens
- [d-nummer][dnum] (dNum) - 11 digit number issued to people allowed to live and
  work in Norway.
- [KID-nummer] - varying length number used to identify digital invoices.

## Quick start

```
npm install utallig

# or

yarn install utallig
```

### Generate fødselsnummer:

```typescript
import { fNum } from 'utallig';

// A completely random fNum
const random = fNum();

// A random fNum for a male person born between 1979 and 1980, inclusive.
const randomWithOptions = fNum({
  startYear: 1970,
  endYear: 1980,
  gender: 'm',
});
```

### Controlling the random generator

By default, the library uses the `Math.random()` built-in function in
JavaScript. It's possible to pass in other random number generators. This can be
useful to generate predictable mock data by using a seedable random generator:

```typescript
import { fNum } from 'utallig';
import seedrandom from 'seedrandom';

const rng = seedrandom('my seed');
const random = fNum();
```

Every time this code runs, it generates the same random fNum.

[orgnum]:
  https://www.brreg.no/om-oss/registrene-vare/om-enhetsregisteret/organisasjonsnummeret/
[brreg]: https://www.brreg.no
[dnum]:
  https://www.skatteetaten.no/person/utenlandsk/norsk-identitetsnummer/d-nummer/
[fnum]:
  https://www.skatteetaten.no/person/utenlandsk/norsk-identitetsnummer/fodselsnummer/
