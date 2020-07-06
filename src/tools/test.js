const { processor: replaceTokens } = require('./replace-tokens')
const StdJson = require('../lib/utils/std-json')

const SPEC_PATH = '../../samples/chainspec/chainspec.sample.json'

const validatorSpec = {
  "validators": [
    {
      "ed25519": {
        "address": "5HUnRcvSFLtXNYPxejvei4k4AmMaWQkXtm62VnMNsviS8Sro",
        "public_key": "0xef8a6f45b9cec7e006831a0b166019745812f7095c13dcd9cb0a9ca5640171f0"
      },
      "sr25519": {
        "address": "5EfHFfEEPXbA6anh3VF9SMC9hwBsUj8mSwvuMEry364CF9rk",
        "public_key": "0x72d73ba30763dd7f47ef6fdd516ba7ce4717ab1e1e01eb0d352beee8d716865f"
      }
    },
    {
      "ed25519": {
        "address": "5H2UQF7vpdgQsLrE3cvd2XDsgjtQBWj9ty6e5W24Hp4ej3tW",
        "public_key": "0xdb796181c73d0ab1ceae988f3e08dbf4d7deda819fa252b4e9e61d64cc26c0c5"
      },
      "sr25519": {
        "address": "5F7ez6ZBo2kLqRbTDFit7EfHrdQVyNFHA5R5NDwQi5ingCgK",
        "public_key": "0x86f4c4ced5e7aa4da78f80a9273e1f8e9f09ef986c6cc29b886ad5d4a1dc1a71"
      }
    }
  ]
}


const rawPallet = StdJson.read('./palletydoo.json')

const pallet = replaceTokens({ rawPallet, tokens: validatorSpec.validators })

const spec = StdJson.read(SPEC_PATH)
spec.genesis.runtime = { ...spec.genesis.runtime, ...pallet }

console.log(StdJson.stringify(spec))
