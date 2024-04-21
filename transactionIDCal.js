




// const transaction = {
//     "version": 2,
//     "locktime": 0,
//     "vin": [
//       {
//         "txid": "59c75148ae1cbf4762d22d28296c50ade987a422574f8c05a082e7272f55f9e5",
//         "vout": 0,
//         "prevout": {
//           "scriptpubkey": "0014dcad8d0dca50f50d3970f5120a4101b9b1f1bd17",
//           "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 dcad8d0dca50f50d3970f5120a4101b9b1f1bd17",
//           "scriptpubkey_type": "v0_p2wpkh",
//           "scriptpubkey_address": "bc1qmjkc6rw22r6s6wts75fq5sgphxclr0ghkjkrsw",
//           "value": 63882
//         },
//         "scriptsig": "",
//         "scriptsig_asm": "",
//         "witness": [
//           "3045022100897c872a4bfc4c0a687752ce200a311da499a8344fc1890c549391e8e1ddc993022078ae58dc7cd7ce13587dc793f919a3190d4ed1c4fe73336464d8c7b79bbdd3a801",
//           "036ed1eba9da3f9f792f6e64f58d1a2ce44feaec850faf7404407528538b8085b2"
//         ],
//         "is_coinbase": false,
//         "sequence": 4294967293
//       }
//     ],
//     "vout": [
//       {
//         "scriptpubkey": "a91472561adfc85743c700deb9c705dfb490a059897087",
//         "scriptpubkey_asm": "OP_HASH160 OP_PUSHBYTES_20 72561adfc85743c700deb9c705dfb490a0598970 OP_EQUAL",
//         "scriptpubkey_type": "p2sh",
//         "scriptpubkey_address": "3C7a76Emn7CF4EF1GiBsbKWfmpTe658uA8",
//         "value": 62662
//       }
//     ]
//   }

const crypto = require('crypto');

function doubleSHA256(data) {
    const firstHash = crypto.createHash('sha256').update(data).digest();
    return crypto.createHash('sha256').update(firstHash).digest();
}

function GetSegwitTransactionID(transaction){

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


    // nLockTime
    let nLockTime = Buffer.alloc(4);
    nLockTime.writeInt32LE(0, 0);


    // tx in/out count
    let tx_in_count = Buffer.alloc(1);
    tx_in_count.writeInt8(numOfInputs, 0);
    // tx_in_count.writeInt16LE(numOfInputs,0);
    let tx_out_count = Buffer.alloc(1);
    tx_out_count.writeUInt8(numOfOutputs, 0);

    let final_tx = Buffer.concat([
        version,
        tx_in_count,
        vinSerialization,
        tx_out_count,
        outputSerialization,
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


    let hashedTrans = doubleSHA256(final_tx);
    let hexhashedTrans = hashedTrans.toString('hex');
    let TXID = toLittleEndian(hexhashedTrans)
    // console.log(TXID)

    return TXID;
  
}

// GetSegwitTransactionID(transaction);

module.exports = GetSegwitTransactionID