// const crypto = require('crypto');

// function wTXID(transaction){

    
//     // Helper function to perform double SHA-256
//     function doubleSHA256(data) {
//         const firstHash = crypto.createHash('sha256').update(data).digest();
//         return crypto.createHash('sha256').update(firstHash).digest();
//     }

//     // Convert a number to a little-endian buffer
//     function toLittleEndian(value, byteSize) {
//         const buffer = Buffer.alloc(byteSize);
//         if (byteSize === 8) {
//             buffer.writeBigInt64LE(BigInt(value), 0); // Use writeBigInt64LE for 64-bit integers
//         } else {
//             buffer.writeIntLE(value, 0, byteSize); // Use writeIntLE for integers that are less than 8 bytes
//         }
//         return buffer;
//     }
    

//     // Convert a hex string to a Buffer and reverse its byte order
//     function reverseHex(hexString) {
//         return Buffer.from(hexString, 'hex').reverse();
//     }

//     // Prepare transaction components
//     const version = toLittleEndian(transaction.version, 4);
//     const txid1 = reverseHex("3f9b265d27a14bfe7b7ab3cfd2b627d08cefef3500cce64a917d2ef56d68cb22");
//     const index1 = toLittleEndian(0, 4);
//     const txid2 = reverseHex("be25ce7702d7e9ced5997f126a34413e381264cc4290476a968cfd9343d17933");
//     const index2 = toLittleEndian(0, 4);
//     const outpointForHashPrevOut = Buffer.concat([txid1, index1, txid2, index2]);
//     const hashPrevOut = doubleSHA256(outpointForHashPrevOut);

//     const sequence = Buffer.from("ffffffff", 'hex');
//     const hashSequence = doubleSHA256(sequence);

//     const amount = toLittleEndian(38499, 8);
//     const value = toLittleEndian(37789, 8);
//     const pkScript = Buffer.from("51209899635de3ff26e498b712170cf71de883cf62af0fdcc72b3b146c4e197f4867", 'hex');
//     const pkScriptLen = Buffer.from([pkScript.length]);

//     const output = Buffer.concat([value, pkScriptLen, pkScript]);
//     const hashOutput = doubleSHA256(output);

//     const nLockTime = toLittleEndian(0, 4);
//     const sighash = Buffer.from("01000000", 'hex');

//     // Dummy values for signature and public key, since generating these requires a private key and signing
//     const signature = Buffer.from("3044022100884219ecbb54a6ec4d09597ca6aca49692ded3c2ffb13d1858ca5b70e59fabb4021f2de73021471a01d8f03a71a923b662f00120d181d0f7fa8e06faa1bb750e8f01", 'hex');
//     const publicKey = Buffer.from("0271d4e7a84804c075017593271c370e8983f704f123d22aa747cd321268981cba", 'hex');

//     // Construct the witness as per the structure
//     const witness = Buffer.concat([
//         Buffer.from("02", 'hex'), // Number of witness elements
//         Buffer.from([signature.length]), // Length of signature
//         signature,
//         Buffer.from([publicKey.length]), // Length of public key
//         publicKey
//     ]);

//     // Redeem script and transaction counts are placeholders
//     const redeemScript = Buffer.alloc(0); // Placeholder for actual redeem script
//     const txInCount = Buffer.from([1]);
//     const txOutCount = Buffer.from([1]);

//     // Final transaction composition
//     const finalTx = Buffer.concat([
//         version,
//         Buffer.from("00", 'hex'), // Marker
//         Buffer.from("01", 'hex'), // Flag
//         txInCount,
//         Buffer.concat([txid1, index1]), // Outpoint
//         Buffer.from("00", 'hex'), // ScriptSig (empty for witness transactions)
//         sequence,
//         txOutCount,
//         output,
//         witness,
//         nLockTime
//     ]);

//     console.log(finalTx.toString('hex'));



// }

// wTXID();









const transaction = {
    "version": 1,
    "locktime": 0,
    "vin": [
      {
        "txid": "41e673584c2b7c0d09c9eef04702f191dcb742a2f4a9d344f9057747f3677ad3",
        "vout": 19,
        "prevout": {
          "scriptpubkey": "001494afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 94afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_type": "v0_p2wpkh",
          "scriptpubkey_address": "bc1qjjhu3c0p9ma76f07nlepjjj77htavhque94ped",
          "value": 68000
        },
        "scriptsig": "",
        "scriptsig_asm": "",
        "witness": [
          "3044022014dad2ddb06e0eff85681e9d13afce2865770e2faad1f42b7f5d3fd8b30157d702205c00659414c207ae5a2abae48270b43ebaae94844f2473a50693103d572636db01",
          "03e77ff2a564ef64bb76dc14614165a23474510b636c03acad32d7d29d9b1f30fc"
        ],
        "is_coinbase": false,
        "sequence": 4294967295
      },
      {
        "txid": "c1f1589af2718992c18dcd474fd1130fb2a3e0e9ed4886f469599a8c5670c0bd",
        "vout": 1,
        "prevout": {
          "scriptpubkey": "001494afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 94afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_type": "v0_p2wpkh",
          "scriptpubkey_address": "bc1qjjhu3c0p9ma76f07nlepjjj77htavhque94ped",
          "value": 76400
        },
        "scriptsig": "",
        "scriptsig_asm": "",
        "witness": [
          "30440220539ace91d8efa461393c207135542c710109a114b0d7c1e01edb3d47b29c9f8002207e93483c56822295f6f5871e1c35ca8bd0d48cc08de95b38825c191c0dc80d2501",
          "03e77ff2a564ef64bb76dc14614165a23474510b636c03acad32d7d29d9b1f30fc"
        ],
        "is_coinbase": false,
        "sequence": 4294967295
      },
      {
        "txid": "51334522ac070dd69f699069c0ebe65e33f7886dfc714e9b01b3beda04f7dca5",
        "vout": 1,
        "prevout": {
          "scriptpubkey": "001494afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 94afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_type": "v0_p2wpkh",
          "scriptpubkey_address": "bc1qjjhu3c0p9ma76f07nlepjjj77htavhque94ped",
          "value": 9761
        },
        "scriptsig": "",
        "scriptsig_asm": "",
        "witness": [
          "3045022100c3aa5ea91a8e80d245f160452436ffdab0e7493f0c96d4ee5b9959d420aeaa8f0220552b08ef62c7135e2dfca81c13c223d17b23ce42a858d5208483745e6e2aa33d01",
          "03e77ff2a564ef64bb76dc14614165a23474510b636c03acad32d7d29d9b1f30fc"
        ],
        "is_coinbase": false,
        "sequence": 4294967295
      },
      {
        "txid": "a2e98b032371305223f1424295817082d74bd19550fc225c90bc565aac28410e",
        "vout": 1,
        "prevout": {
          "scriptpubkey": "001494afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 94afc8e1e12efbed25fe9ff2194a5ef5d7d65c1c",
          "scriptpubkey_type": "v0_p2wpkh",
          "scriptpubkey_address": "bc1qjjhu3c0p9ma76f07nlepjjj77htavhque94ped",
          "value": 9423
        },
        "scriptsig": "",
        "scriptsig_asm": "",
        "witness": [
          "3045022100ae490464d36d50deacd176a81de5dadbb67f8fc1580c56ad0b6e406bd08b92ea02203aa00eaaaff00da3c34bdc459eab443fa5c6385ab356d769c354966706fc980801",
          "03e77ff2a564ef64bb76dc14614165a23474510b636c03acad32d7d29d9b1f30fc"
        ],
        "is_coinbase": false,
        "sequence": 4294967295
      }
    ],
    "vout": [
      {
        "scriptpubkey": "0014fb8c7919bf91b7694791db553995300e0a2c15f3",
        "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 fb8c7919bf91b7694791db553995300e0a2c15f3",
        "scriptpubkey_type": "v0_p2wpkh",
        "scriptpubkey_address": "bc1qlwx8jxdljxmkj3u3md2nn9fspc9zc90nghm9pc",
        "value": 155106
      }
    ]
  }

const crypto = require('crypto');

function doubleSHA256(data) {
    const firstHash = crypto.createHash('sha256').update(data).digest();
    return crypto.createHash('sha256').update(firstHash).digest();
}

function wTXID(transaction){

        // version
    let version = Buffer.alloc(4);
    version.writeInt32LE(transaction.version, 0);

    let scriptSigSize = Buffer.from("00", 'hex');

    // Input Serialization START

    let numOfInputs = 0;
    let vinSerializationPart = []
    let vinSerialization;
    transaction.vin.forEach(input => {
        let txid = Buffer.from(input.txid, 'hex').reverse();
        let index = Buffer.alloc(4);
        index.writeInt32LE(input.vout, 0);
        
        // scriptSig basically 0
        scriptSigSize

        //sequence
        const seq_number = input.sequence;
        const seqBuffer = Buffer.alloc(4);
        seqBuffer.writeUInt32LE(seq_number);

        // counting number of input
        ++numOfInputs;

        vinSerializationPart.push(txid, index, scriptSigSize, seqBuffer);
    })
    vinSerialization = Buffer.concat(vinSerializationPart);

    // Input Serialization END


    // Output Serialization START

    let numOfOutputs = 0;
    let outputSerializationPart = [];
    let outputSerialization;
    transaction.vout.forEach(output => {
        //output amount
        let value = Buffer.alloc(8);
        value.writeBigInt64LE(BigInt(output.value), 0);

        let pk_script = Buffer.from(output.scriptpubkey, 'hex');
        let pk_script_len = Buffer.alloc(1);
        pk_script_len.writeInt8(pk_script.length, 0);

        output = Buffer.concat([value, pk_script_len, pk_script]);

        //couting the number of output/outputs
        ++numOfOutputs;

        outputSerializationPart.push(output);
    })
    outputSerialization = Buffer.concat(outputSerializationPart);

    // Output Serialization END

    // witness serialization START
    let witnessSerializationPart = [];
    let witnessSerialization;
    transaction.vin.forEach(input => {
        let sig = input.witness[0];
        let pubkey = input.witness[1];

        // Convert the hex strings into Buffer objects
        let sigBuffer = Buffer.from(sig, 'hex'); // Converts the hex signature string to a Buffer
        let pubkeyBuffer = Buffer.from(pubkey, 'hex'); // Converts the hex public key string to a Buffer

        let sigLength = Buffer.alloc(1);
        sigLength[0] = sigBuffer.length; // Length of the signature

        let pubkeyLength = Buffer.alloc(1);
        pubkeyLength[0] = pubkeyBuffer.length; // Length of the public key

        let witness = Buffer.concat([
            Buffer.from("02", 'hex'), // Number of witness elements
            sigLength, // Length of signature
            sigBuffer, // Signature
            pubkeyLength, // Length of public key
            pubkeyBuffer // Public key
        ]);
        witnessSerializationPart.push(witness)
    })
    witnessSerialization = Buffer.concat(witnessSerializationPart);
    // witness serialization END


    // nLockTime
    let nLockTime = Buffer.alloc(4);
    nLockTime.writeInt32LE(0, 0);


    // tx in/out count





    function writeVarInt(value) {
      const buffer = Buffer.alloc(9); // Maximum size needed for VarInt
      if (value < 0xfd) {
          // Use 1 byte for values < 253
          return Buffer.from([value]);
      } else if (value <= 0xffff) {
          // Use 3 bytes for values <= 65535
          buffer[0] = 0xfd;
          buffer.writeUInt16LE(value, 1);
          return buffer.slice(0, 3);
      } else if (value <= 0xffffffff) {
          // Use 5 bytes for values <= 4294967295
          buffer[0] = 0xfe;
          buffer.writeUInt32LE(value, 1);
          return buffer.slice(0, 5);
      } else {
          // Use 9 bytes for larger values
          buffer[0] = 0xff;
          buffer.writeUInt32LE(value & 0xFFFFFFFF, 1); // Lower 32 bits
          buffer.writeUInt32LE(Math.floor(value / 0x100000000), 5); // Upper 32 bits
          return buffer.slice(0, 9);
      }
  }
  
  function createTransactionInputBuffer(numOfInputs) {
      // Use the VarInt encoding for the number of inputs
      return writeVarInt(numOfInputs);
  }







    // let tx_in_count = Buffer.alloc(1);
    let tx_in_count = createTransactionInputBuffer(numOfInputs);
    // tx_in_count.writeUInt8(numOfInputs, 0);
    // tx_in_count.writeInt16LE(numOfInputs,0);
    let tx_out_count = Buffer.alloc(1);
    tx_out_count.writeUInt8(numOfOutputs, 0);
    let final_tx = Buffer.concat([
        version,
        Buffer.from("00", 'hex'), // Marker
        Buffer.from("01", 'hex'), // Flag
        tx_in_count,
        vinSerialization,
        tx_out_count,
        outputSerialization,
        witnessSerialization,
        nLockTime
    ]);



    function toLittleEndian(hexString) {
      if (hexString.length % 2 !== 0) {
          throw new Error('Invalid hex string');
      }

      // Split the string into chunks of two characters (one byte each)
      let bytes = hexString.match(/.{1,2}/g);

      // Reverse the array of byte chunks to switch from big-endian to little-endian
      bytes.reverse();

      // Join the array back into a single string
      return bytes.join('');
    }

    // console.log(final_tx.toString('hex'));
    let hashedTrans = doubleSHA256(final_tx);
    let hexhashedTrans = hashedTrans.toString('hex');
    let wTXID = toLittleEndian(hexhashedTrans)
    // console.log(wTXID)

    return wTXID;
  
}

// console.log(wTXID(transaction));

module.exports = wTXID;