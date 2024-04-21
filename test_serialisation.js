
const crypto = require('crypto');
const verifySignature = require('./sig_verify')
const GetSegwitTransactionID = require('./transactionIDCal')
const merkleroot = require('./merkleRoot');
const wTXID = require('./witnessTransIdCal');
const { hash256 } = require('bitcoinjs-lib/src/crypto');
// const mineBlock = require('./mining');
const runMining = require('./mining')
let numOfP2wpkhTrans = 0;
let totalfee = 0;
// keeps track of transaction IDs
let txids = [];
let wTxids = [];
function serialization(transaction, isLastFile) {
    let wholeTransValid = true;
    let p2wpkhInputCount = 0;
    let totalInputcount = 0;
    transaction.vin.forEach(input => {
        if(input.prevout.scriptpubkey_type == "v0_p2wpkh"){
            ++p2wpkhInputCount;
        }
        ++totalInputcount;
    })

    if(p2wpkhInputCount == totalInputcount){


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
        
            // console.log("BIP 143 Transaction Hex:", bip143.toString('hex'));
            const hashedBip143 = doubleSHA256(bip143);
            hashedBip143forSig = hashedBip143;
            console.log("Hashed BIP 143:", hashedBip143.toString('hex'));
        
        
            const pubkeyHex = input.witness[1];
            const signatureHex = input.witness[0];
            const messageHashHex = hashedBip143forSig.toString('hex')
            let getTransVerifyStatus = verifySignature(pubkeyHex,signatureHex,messageHashHex);
                
                // check condition to validate whole transaction is valid or not
                if(getTransVerifyStatus == false){
                    wholeTransValid = false;
                }
        })

        // transaction input output amount verificatiion START
        let totalInputAmount = 0;
        let totalOutputAmount = 0;

        transaction.vin.forEach(input => {
            totalInputAmount += input.prevout.value;
        })

        transaction.vout.forEach(output => {
            totalOutputAmount += output.value;
        })

        if(totalInputAmount < totalOutputAmount){
            wholeTransValid = false;
        }
        
        // transaction input output amount verificatiion END

        // transaction Script verification START
        function hash160(buffer) {
            const sha256Hash = crypto.createHash('sha256').update(buffer).digest();
            return crypto.createHash('ripemd160').update(sha256Hash).digest();
        }

        //extracting the pubkeyhash from prev output
        transaction.vin.forEach(input => {
            let scriptpubkey_asm = input.prevout.scriptpubkey_asm;
            const items = scriptpubkey_asm.split(' ');
            const pubkeyHashFromPrevOutput = items[2];
        
            // const pubkeyHashFromWitness = input.witness[1];
            const pubkeyHashFromWitness = Buffer.from(input.witness[1], 'hex');

            const publicKeyHash160 = hash160(pubkeyHashFromWitness).toString('hex');

            if(publicKeyHash160 != pubkeyHashFromPrevOutput){
                wholeTransValid = false;
            }

        })
        // transaction Script verification END
        if(totalInputcount > 127){
            wholeTransValid = false;
        }
        if(transaction.locktime > 0){
            wholeTransValid = false;
        }
        if(wholeTransValid == true){
            let singleTransID = GetSegwitTransactionID(transaction)
            txids.push(singleTransID);

            // calculating the fee 
            totalfee = totalfee + (totalInputAmount - totalOutputAmount)

            // calculating the wtxid
            let singleWtxid = wTXID(transaction);
           
            wTxids.push(singleWtxid);

            ++numOfP2wpkhTrans;
            console.log(numOfP2wpkhTrans);
        }

    }


    // merkle root calling 
    let witnessRootHash;
    if((isLastFile == true) ){
        function doubleSHA256(data) {
            const firstHash = crypto.createHash('sha256').update(data).digest();
            return crypto.createHash('sha256').update(firstHash).digest();
        }

        // for witness merkle root START
        // let witnessRootHash;
        wTxids.unshift("0000000000000000000000000000000000000000000000000000000000000000");
        wTxids = wTxids.map(txid => txid.match(/../g).reverse().join(''));
        
        // Calculate the Merkle root
        let WitnessRoot = merkleroot(wTxids);
        
        // Reverse the final root to match the Ruby's output example
        // console.log("Witness merkle root is: "+ WitnessRoot.match(/../g).reverse().join(''));
        // console.log("Witness Natural merkle root is: "+ WitnessRoot.match(/../g).join(''));
        witnessRootHash = WitnessRoot.match(/../g).join('');
        // Witness Root Hash END

        // coinbase START
        witnessCommitment = witnessRootHash + "0000000000000000000000000000000000000000000000000000000000000000"
        let witnessCommitmentBuffer = Buffer.from(witnessCommitment, 'hex');
        let witnessHashed = hash256(witnessCommitmentBuffer);   
        let wxidCommitment = witnessHashed.toString('hex');

        let amountinRaw = 1250000000 + totalfee;
        let amountBigInt = BigInt(amountinRaw);
        let amountBuffer = Buffer.alloc(8)
        amountBuffer.writeBigInt64LE(amountBigInt,0);
        let hexAmount = amountBuffer.toString('hex');
        
        let witnessTransaction = "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff2503233708184d696e656420627920416e74506f6f6c373946205b8160a4256c0000946e0100ffffffff02" 
        +  hexAmount + "1976a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac0000000000000000266a24aa21a9ed" +  wxidCommitment + "0120000000000000000000000000000000000000000000000000000000000000000000000000"
        // let witnessTransactionBuffer = Buffer.from(witnessTransaction, 'hex');
        // // hash the buffer
        // let hashedWitnessTransaction = doubleSHA256(witnessTransactionBuffer);
        // // reverse the bytes 
        // let reversedHashedWitnessTransaction = hashedWitnessTransaction.reverse();

        // // Convert the reversed hash back to a hexadecimal string
        // let reversedHashedWitnessHex = reversedHashedWitnessTransaction.toString('hex');

        let coinbaseinHex = "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2503233708184d696e656420627920416e74506f6f6c373946205b8160a4256c0000946e0100ffffffff02" 
        +  hexAmount + "1976a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac0000000000000000266a24aa21a9ed" +  wxidCommitment + "00000000"
        let coinbaseHash = doubleSHA256(Buffer.from(coinbaseinHex, 'hex'));
        // Reverse the hash to get the txid
        let coinbasetxid = coinbaseHash.reverse().toString('hex');
        // coinbse END

        console.log("number of valid transactions: " + numOfP2wpkhTrans);
        console.log("The total fee is: " + totalfee);

        txids.unshift(coinbasetxid)
        // Reversing each txid to match Ruby's example
        txids = txids.map(txid => txid.match(/../g).reverse().join(''));
        
        // Calculate the Merkle root
        let root = merkleroot(txids);
        
        // Reverse the final root to match the Ruby's output example
        let merkleRootNBO = root.match(/../g).reverse().join('');
        // console.log("merkle root is: "+root.match(/../g).reverse().join(''));
        console.log("merkle root is: "+root.match(/../g).join(''));

        //calling to mine a block
        runMining(merkleRootNBO,witnessTransaction, txids)
        txids = [];
        wTxids = [];
    }

    // creating the coinbase transaction
    
}

module.exports = serialization;
// module.exports = provideTxidToMerkleRoot;


