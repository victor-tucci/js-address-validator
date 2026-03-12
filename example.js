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