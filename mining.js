const crypto = require('crypto');
const fs = require('fs');

function doubleSHA256(data) {
    const firstHash = crypto.createHash('sha256').update(data).digest();
    return crypto.createHash('sha256').update(firstHash).digest();
}

function createOutputFile(blockHeader, serializedCoinbase, txids) {
    const content = [
        blockHeader,
        serializedCoinbase,
        ...txids.map(txid => txid)
    ].join('\n');

    fs.writeFile('output.txt', content, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

function serializeBlockHeader({
    version, prevBlockHash, merkleRoot, time, bits, nonce
}) {
    const buffer = Buffer.alloc(80); // Block header is always 80 bytes
    buffer.writeInt32LE(version, 0); // Version - 4 bytes
    buffer.write(prevBlockHash, 4, 32, 'hex'); // Previous Block Hash - 32 bytes starts at offset 4
    buffer.write(merkleRoot, 36, 'hex'); // Merkle Root - 32 bytes starts at offset 36
    buffer.writeUInt32LE(time, 68); // Time - 4 bytes starts at offset 68
    buffer.writeUInt32LE(bits, 72); // Bits - 4 bytes starts at offset 72
    buffer.writeUInt32LE(nonce, 76); // Nonce - 4 bytes starts at offset 76
    return buffer.toString('hex');
}


function mineBlock(version, prevBlockHash, merkleRoot, time, bits, difficultyTarget) {
    return new Promise((resolve, reject) => {
        setImmediate(function mine(nonce) {
            // Create the block header
            const header = Buffer.alloc(80); // Standard Bitcoin block header size is 80 bytes
            header.writeInt32LE(version, 0); // Version (4 bytes)
            header.write(prevBlockHash, 4, 32, 'hex'); // Previous Block Hash (32 bytes)
            header.write(merkleRoot, 36, 32, 'hex'); // Merkle Root (32 bytes)
            header.writeUInt32LE(time, 68); // Time (4 bytes)
            header.writeUInt32LE(bits, 72); // Bits (4 bytes)
            header.writeUInt32LE(nonce, 76); // Nonce (4 bytes)


            // Hash the block header
            let hash = doubleSHA256(header);
            let hashInt = BigInt('0x' + hash.toString('hex').match(/../g).reverse().join('')); // Convert hash to bigint in big-endian

            let target = BigInt('0x' + difficultyTarget); // Convert difficulty target from hex to BigInt

            if (hashInt < target) {
                return resolve({
                    version,
                    prevBlockHash,
                    merkleRoot,
                    time,
                    bits,
                    nonce,
                    hash: hash.toString('hex'),
                    headerHex: serializeBlockHeader({
                        version, prevBlockHash, merkleRoot, time, bits, nonce
                    })
                    // target: difficultyTarget 
                });
            } else if (nonce < Number.MAX_SAFE_INTEGER) {
                setImmediate(mine, nonce + 1); // Recursively call mine with next nonce value
            } else {
                return reject(new Error("Nonce limit reached without success"));
            }
        }, 0);
    });
}

// Example usage:
async function runMining(merkleRootPassed, coinbaseSerializedTrans,txids) {
    try {
        const version = 0x20000000;
        const prevBlockHash = '0000000000000000000000000000000000000000000000000000000000000000';
        const merkleRoot = merkleRootPassed;
        const time = Math.floor(new Date().getTime() / 1000);
        const bits = 0x1f00ffff;
        const difficultyTarget = '0000ffff00000000000000000000000000000000000000000000000000000000';

        const result = await mineBlock(version, prevBlockHash, merkleRoot, time, bits, difficultyTarget);
        console.log(result.headerHex);

        createOutputFile(result.headerHex,coinbaseSerializedTrans,txids)
    } catch (error) {
        console.error(error);
    }
}

// runMining();

module.exports = runMining;
