const crypto = require('crypto');

// Function to perform double SHA-256 hashing
function hash256(hex) {
    let buffer = Buffer.from(hex, 'hex');
    let hash1 = crypto.createHash('sha256').update(buffer).digest();
    let hash2 = crypto.createHash('sha256').update(hash1).digest();
    return hash2.toString('hex');
}

// Recursive function to calculate Merkle root
function merkleroot(txids) {
    if (txids.length === 1) {
        return txids[0]; // Return the final hash in hex
    }

    let result = [];
    for (let i = 0; i < txids.length; i += 2) {
        let one = txids[i];
        let two = txids[i + 1];
        if (!two) {
            two = one; // If no pair, duplicate it
        }
        let concat = one + two;
        result.push(hash256(concat));
    }
    return merkleroot(result);
}

// Example transaction IDs
// let txids = [
//     "de13320bfadaa94418ced122d33578a16ebd093b6455ece6e27360f202fbce35",
//     "e88b92f2893367a68011256e1a1488fd25c05386c79d284221a4156e5de21db8"
// ]

// Reversing each txid to match Ruby's example
// txids = txids.map(txid => txid.match(/../g).reverse().join(''));

// // Calculate the Merkle root
// let root = merkleroot(txids);

// // Reverse the final root to match the Ruby's output example
// console.log(root.match(/../g).reverse().join(''));

module.exports = merkleroot;