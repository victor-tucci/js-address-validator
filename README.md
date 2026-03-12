# Beldex Address Validator (JS)

A lightweight JavaScript library to validate Beldex addresses, support for Mainnet, Testnet, and Devnet.

## Features

- Validate Beldex standard addresses, subaddresses, and integrated addresses.
- Detect network type (Mainnet, Testnet, Devnet).
- Checksum verification using Keccak-256.
- Base58 decoding.

## Installation

```bash
npm install
```

Requires `keccak` dependency.

## Usage

```javascript
const { validateBeldexAddress } = require('./address_validator');

const address = "bxdxaZ4Kgcx8TjeiErpSP8fCqb6DSaBVT7XTctpeTL6HQRc74rPtwHvW8ineqDpUsLLjj62ipD1R9f9a919gG5v51mcHUGeBJ";
const result = validateBeldexAddress(address);

if (result.valid) {
  console.log(`Address is valid!`);
  console.log(`Network: ${result.network}`);
  console.log(`Type: ${result.type}`);
} else {
  console.log(`Invalid address: ${result.reason}`);
}
```

## Supported Address Types

- **Standard Address**: The primary address for a wallet.
- **Subaddress**: Generated addresses for receiving payments without revealing the primary address.
- **Integrated Address**: A standard address bundled with a payment ID.

## Technical Details

Beldex addresses use a Monero-style encoding:
1. **Prefix**: A network-specific byte indicating the address type.
2. **Public Spend Key**: 32 bytes.
3. **Public View Key**: 32 bytes.
4. **Checksum**: 4 bytes (Hash of the above data).

The entire package is encoded using Beldex's modified Base58 format.

## License

GPL-3.0 license
