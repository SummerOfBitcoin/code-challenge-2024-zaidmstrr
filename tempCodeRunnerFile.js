const crypto = require('crypto');

// Function to perform SHA-256 hashing
function hash256(data) {
    return crypto.createHash('sha256').update(data).digest();
}

// Assuming witnessTransactionBuffer is the buffer you created from the full transaction
let witnessTransactionBuffer = Buffer.from('010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff2503233708184d696e656420627920416e74506f6f6c373946205b8160a4256c0000946e0100ffffffff02' + '00f2052a01000000' + '1976a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac0000000000000000266a24aa21a9ed' + 'b3c457fab8f832b0316fccc1e6b044176a962b58dbb93d130b9317c8c6731ffb' + '0120000000000000000000000000000000000000000000000000000000000000000000000000', 'hex');

// Hash the buffer
let hashedWitnessTransaction = hash256(witnessTransactionBuffer);

// Reverse the bytes of the hash
let reversedHashedWitnessTransaction = hashedWitnessTransaction;

// Convert the reversed hash back to a hexadecimal string
let reversedHashedWitnessHex = reversedHashedWitnessTransaction.toString('hex');

// Output the reversed hash as hex
console.log(reversedHashedWitnessHex);
