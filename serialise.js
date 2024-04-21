


const crypto = require('crypto');
const verifySignature = require('./sig_verify')

const transaction ={
  "version": 2,
  "locktime": 0,
  "vin": [
    {
      "txid": "64ca1941edef34b690dd6672c7d395c60882067f7f3fc396e64d88e39c1da5b4",
      "vout": 0,
      "prevout": {
        "scriptpubkey": "0014d5bfb7a6d05d44c1e14443919b30d284c0c0a10a",
        "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 d5bfb7a6d05d44c1e14443919b30d284c0c0a10a",
        "scriptpubkey_type": "v0_p2wpkh",
        "scriptpubkey_address": "bc1q6klm0fkst4zvrc2ygwgekvxjsnqvpgg2jjfurm",
        "value": 10740
      },
      "scriptsig": "",
      "scriptsig_asm": "",
      "witness": [
        "3044022100884219ecbb54a6ec4d09597ca6aca49692ded3c2ffb13d1858ca5b70e59fabb4021f2de73021471a01d8f03a71a923b662f00120d181d0f7fa8e06faa1bb750e8f01",
        "0271d4e7a84804c075017593271c370e8983f704f123d22aa747cd321268981cba"
      ],
      "is_coinbase": false,
      "sequence": 4294967293
    }
  ],
  "vout": [
    {
      "scriptpubkey": "a91450feb99697a4901d3fe082eca341204fb6711b9487",
      "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 50feb99697a4901d3fe082eca341204fb6711b94 OP_EQUAL",
      "scriptpubkey_type": "p2sh",
      "scriptpubkey_address": "395H8VPYPtAoZWa2bx5SRyN2VojXrsb7j3",
      "value": 9520
    }
  ]
}

let hashedBip143forSig;

function doubleSHA256(data) {
    const firstHash = crypto.createHash('sha256').update(data).digest();
    return crypto.createHash('sha256').update(firstHash).digest();
}

// Corrected function to handle 64-bit integers
function intToLE(value, byteSize) {
    const buffer = Buffer.alloc(byteSize);
    if (byteSize === 8) {
        buffer.writeBigInt64LE(BigInt(value), 0);
    } else {
        buffer.writeIntLE(value, 0, byteSize);
    }
    return buffer;
}

// inpit serialization
const version = intToLE(transaction.version, 4);
let transIDandIndexPart = [];
let sequencePart = [];
transaction.vin.forEach(input =>{
  const txid = Buffer.from(input.txid, 'hex').reverse();
  const index = intToLE(input.vout, 4);
  transIDandIndexPart.push(txid,index);


  const seq_number = input.sequence;
  const seqBuffer = Buffer.alloc(4);
  seqBuffer.writeUInt32LE(seq_number);
  const littleEndianHex = seqBuffer.toString('hex');
  const sequenceForConcatenate = Buffer.from(littleEndianHex, 'hex');
  sequencePart.push(sequenceForConcatenate);
})

const outpointForHash = Buffer.concat(transIDandIndexPart);
const hashPrevOut = doubleSHA256(outpointForHash);

const sequenceConcatenated = Buffer.concat(sequencePart);
const hashSequence = doubleSHA256(sequenceConcatenated);

// output serializaation START

// Output

let parts = [];

transaction.vout.forEach(output =>{
    const value = intToLE(output.value, 8);
    const pkScript = Buffer.from(output.scriptpubkey, 'hex');
    const pkScriptLen = Buffer.from([pkScript.length]);

    parts.push(value,pkScriptLen, pkScript);
})

const output = Buffer.concat(parts);
const hashOutput = doubleSHA256(output);

//sighash
const sighash = Buffer.from("01000000", 'hex');
// nLockTime
const nLockTime = intToLE(transaction.locktime, 4);

// output serialization END

transaction.vin.forEach(input => {
  const scriptPubKeyAsm  = input.prevout.scriptpubkey_asm;
  const splitPubKeyAsm = scriptPubKeyAsm.split(' ');
  const keyhash = splitPubKeyAsm[2];
  const scriptCode = Buffer.from(`1976a914${keyhash}88ac`, 'hex');

  //outpoint
  const txid = Buffer.from(input.txid, 'hex').reverse();
  const index = intToLE(input.vout, 4);
  const outpoint = Buffer.concat([txid, index]);

  //amount from input
  const amount = intToLE(input.prevout.value, 8);

  //sequence 
  const seq_number = input.sequence;
  const seqBuffer = Buffer.alloc(4);
  seqBuffer.writeUInt32LE(seq_number);
  const littleEndianHex = seqBuffer.toString('hex');
  const sequence = Buffer.from(littleEndianHex, 'hex');


  const bip143 = Buffer.concat([
    version,
    hashPrevOut,
    hashSequence,
    outpoint,
    scriptCode,
    amount,
    sequence,
    hashOutput,
    nLockTime,
    sighash
]);

  console.log("BIP 143 Transaction Hex:", bip143.toString('hex'));
  const hashedBip143 = doubleSHA256(bip143);
  hashedBip143forSig = hashedBip143;
  console.log("Hashed BIP 143:", hashedBip143.toString('hex'));


  const pubkeyHex = input.witness[1];
  const signatureHex = input.witness[0];
  const messageHashHex = hashedBip143forSig.toString('hex')
  verifySignature(pubkeyHex,signatureHex,messageHashHex);

})


transaction.vin.forEach(input => {
  // const pubkeyHex = input.witness[1];
  // const signatureHex = input.witness[0];
  // const messageHashHex = hashedBip143forSig.toString('hex')
  // verifySignature(pubkeyHex,signatureHex,messageHashHex);

})


