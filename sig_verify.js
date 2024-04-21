const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
// const EC = require('elliptic').ec;
// const ec = new EC('secp256k1');


// extracting r and s values 


function parseElement(hexSig, offset, length) {
    const endOffset = offset + length;
    const element = hexSig.slice(offset, endOffset);
    return [element, endOffset];
}

function dissectSignature(hexSig) {
    let offset = 0;
    if (hexSig.length <= 4) {
        throw new Error("Wrong signature format.");
    }

    let [sequence, newOffset] = parseElement(hexSig, offset, 2);
    offset = newOffset;
    if (sequence !== '30') {
        throw new Error("Wrong sequence marker.");
    }

    let [signatureLength, newOffset2] = parseElement(hexSig, offset, 2);
    offset = newOffset2;
    const remainingLength = (hexSig.length - offset) / 2;
    if (remainingLength !== parseInt(signatureLength, 16) + 1) {
        throw new Error("Wrong length.");
    }

    let [marker, newOffset3] = parseElement(hexSig, offset, 2);
    offset = newOffset3;
    if (marker !== '02') {
        throw new Error("Wrong r marker.");
    }

    let [lenR, newOffset4] = parseElement(hexSig, offset, 2);
    offset = newOffset4;
    let lenRInt = parseInt(lenR, 16) * 2;
    let [r, newOffset5] = parseElement(hexSig, offset, lenRInt);
    offset = newOffset5;

    let [markerS, newOffset6] = parseElement(hexSig, offset, 2);
    offset = newOffset6;
    if (markerS !== '02') {
        throw new Error("Wrong s marker.");
    }

    let [lenS, newOffset7] = parseElement(hexSig, offset, 2);
    offset = newOffset7;
    let lenSInt = parseInt(lenS, 16) * 2;
    let [s, newOffset8] = parseElement(hexSig, offset, lenSInt);
    offset = newOffset8;

    s = s.length > 2 && s.substring(0, 2) === "00" ? s.substring(2) : s; // Strip leading '00' if it's padding

    let [ht, newOffset9] = parseElement(hexSig, offset, 2);
    offset = newOffset9;
    if (offset !== hexSig.length) {
        throw new Error("Wrong parsing.");
    }

    return { r, s, ht };
}

const exampleSig = "304402206cb268614ab72910e5a975893e7cd2cb84aa58ac4f318cf84547dd3a9562761a0220455f61baeb45533265180d07a6dab52a4034ec0ffb5d7cb85757c562936509ea01";
// try {
//     const { r, s, ht } = dissectSignature(exampleSig);
//     console.log(`r: ${r}\ns: ${s}\nht: ${ht}`);
// } catch (error) {
//     console.error(error);
// }


// sig verification



let signatureHex = "304402206cb268614ab72910e5a975893e7cd2cb84aa58ac4f318cf84547dd3a9562761a0220455f61baeb45533265180d07a6dab52a4034ec0ffb5d7cb85757c562936509ea01";
let pubkeyHex = "030b512819670cf864aa7605c7bfb32e37002db4f30c9d03a8b8aa1976049105aa";
let messageHash = "0a7a676ee7ccb91ab4ad67229ece539d9e38f993a10a40b2df8f2d6b2bfcc260";


function verifySignature(publicKeyHex, signatureHex, messageHashHex) {
    try {



        const { r, s, ht } = dissectSignature(signatureHex);

        // Create a public key object from a hex string
        const publicKey = ec.keyFromPublic(publicKeyHex, 'hex');

        // The signature is expected to be in DER format, directly in hex
        // No need to convert it using a non-existent method
        const signature = { r: r, s: s };

        // The message hash should be a buffer of the actual hash
        const messageHash = Buffer.from(messageHashHex, 'hex');

        // Perform the verification
        const isValid = publicKey.verify(messageHash, signature);

        // console.log("Signature valid:", isValid);
        return isValid;
    } catch (error) {
        console.error("Verification failed:", error);
        return false;
    }
}


// verifySignature(pubkeyHex,signatureHex,messageHash)

module.exports = verifySignature;
