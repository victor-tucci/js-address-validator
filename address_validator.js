const keccak = require("keccak")

const NET_MAIN = "main"
const NET_DEV = "dev"
const NET_TEST = "test"

const NETS = [NET_MAIN, NET_TEST, NET_DEV]

const MASTERADDR_NETBYTES = [0xd1, 53, 24]
const SUBADDR_NETBYTES = [42, 63, 36]
const INTADDR_NETBYTES = [19, 54, 25]

const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

const alphabetMap = {}
for (let i = 0; i < alphabet.length; i++) {
  alphabetMap[alphabet[i]] = i
}

const ENCODED_BLOCK_SIZES = [0, 2, 3, 5, 6, 7, 9, 10, 11]
const FULL_BLOCK_SIZE = 8
const FULL_ENCODED_BLOCK_SIZE = 11

function cnFastHash(data) {
  return keccak("keccak256").update(data).digest()
}

function decodeBlock(data, size) {

  let num = 0n

  for (let i = 0; i < data.length; i++) {
    const val = alphabetMap[data[i]]
    if (val === undefined) throw new Error("Invalid Base58 char")

    num = num * 58n + BigInt(val)
  }

  const res = Buffer.alloc(size)

  for (let i = size - 1; i >= 0; i--) {
    res[i] = Number(num % 256n)
    num = num / 256n
  }

  return res
}

function cnBase58Decode(input) {

  let output = []

  for (let i = 0; i < input.length;) {

    const remain = input.length - i

    if (remain >= FULL_ENCODED_BLOCK_SIZE) {

      const block = input.substr(i, FULL_ENCODED_BLOCK_SIZE)

      output.push(decodeBlock(block, FULL_BLOCK_SIZE))

      i += FULL_ENCODED_BLOCK_SIZE

    } else {

      const size = ENCODED_BLOCK_SIZES.indexOf(remain)

      if (size <= 0) throw new Error("Invalid encoded block size")

      const block = input.substr(i, remain)

      output.push(decodeBlock(block, size))

      break
    }
  }

  return Buffer.concat(output)
}

function validateBeldexAddress(address) {

  try {

    const decoded = cnBase58Decode(address)

    const body = decoded.slice(0, decoded.length - 4)

    const checksum = decoded.slice(decoded.length - 4)

    const hash = cnFastHash(body)

    if (!checksum.equals(hash.slice(0, 4))) {
      return { valid: false, reason: "Checksum mismatch" }
    }

    const prefix = body[0]

    for (let i = 0; i < MASTERADDR_NETBYTES.length; i++) {
      if (prefix === MASTERADDR_NETBYTES[i]) {
        return { valid: true, network: NETS[i], type: "main" }
      }
    }

    for (let i = 0; i < SUBADDR_NETBYTES.length; i++) {
      if (prefix === SUBADDR_NETBYTES[i]) {
        return { valid: true, network: NETS[i], type: "subaddress" }
      }
    }

    for (let i = 0; i < INTADDR_NETBYTES.length; i++) {
      if (prefix === INTADDR_NETBYTES[i]) {
        return { valid: true, network: NETS[i], type: "integrated" }
      }
    }

    return { valid: false, reason: "Unknown prefix" }

  } catch (e) {
    return { valid: false, reason: e.message }
  }
}

module.exports = { validateBeldexAddress }
