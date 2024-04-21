# import hashlib
# import ecdsa

# def dSHA256(raw):
#     hash_1 = hashlib.sha256(raw).digest()
#     hash_2 = hashlib.sha256(hash_1).digest()
#     return hash_2

# # version
# version = (1).to_bytes(4, byteorder="little", signed=False)

# # hashPrevOut + outpoint
# txid = (bytes.fromhex("3f9b265d27a14bfe7b7ab3cfd2b627d08cefef3500cce64a917d2ef56d68cb22"))[::-1]
# index = (0).to_bytes(4, byteorder="little", signed=False)

# txid2 = (bytes.fromhex("be25ce7702d7e9ced5997f126a34413e381264cc4290476a968cfd9343d17933"))[::-1]
# index2 = (0).to_bytes(4, byteorder="little", signed=False)

# outpointforhashPrevout = (
#     txid
#     + index
#     + txid2
#     + index2
# )

# hashPrevOut = dSHA256(outpointforhashPrevout)

# outpoint = (
#     txid
#     + index
# )

# # hashSequence + sequence
# sequence = bytes.fromhex("ffffffffffffffff")
# nsequence = bytes.fromhex("ffffffff")
# hashSequence = dSHA256(sequence)

# # value/amount
# amount = (int(38499)).to_bytes(8, byteorder="little", signed=True)
# # amount2 = (int(2830)).to_bytes(8, byteorder="little", signed=True)

# # hashOutput + output
# value = (int(37789)).to_bytes(8, byteorder="little", signed=True)

# pk_script = bytes.fromhex("51209899635de3ff26e498b712170cf71de883cf62af0fdcc72b3b146c4e197f4867")
# pk_script_len = (len(pk_script)).to_bytes(1, byteorder="little", signed=False)

# # print(pk_script_len.hex())
# # print("====================")

# output = (
#     value
#     + pk_script_len
#     + pk_script
# )

# hashOutput = dSHA256(output)

# # nLockTime
# nLockTime = (0).to_bytes(4, byteorder="little", signed=False)

# # sighash
# sighash = bytes.fromhex("01000000")

# # ecdsa + scriptcode
# import ecdsa

# # private_key = bytes.fromhex("CF933A6C602069F1CBC85990DF087714D7E86DF0D0E48398B7D8953E1F03534A")

# # signing_key = ecdsa.SigningKey.from_string(private_key, curve=ecdsa.SECP256k1) # Don't forget to specify the curve

# # verifying_key = signing_key.get_verifying_key()

# # # Use this code block if the address you gave corresponds to the compressed public key
# # x_cor = bytes.fromhex(verifying_key.to_string().hex())[:32] # The first 32 bytes are the x coordinate
# # y_cor = bytes.fromhex(verifying_key.to_string().hex())[32:] # The last 32 bytes are the y coordinate
# # if int.from_bytes(y_cor, byteorder="big", signed=True) % 2 == 0: # We need to turn the y_cor into a number. 
# #     public_key = bytes.fromhex("02" + x_cor.hex())
# # else:
# #     public_key = bytes.fromhex("03" + x_cor.hex())

# # sha256_1 = hashlib.sha256(public_key)

# # ripemd160 = hashlib.new("ripemd160")
# # ripemd160.update(sha256_1.digest())

# # keyhash = ripemd160.digest()

# keyhash = "88b890c12097264ad9786686fb6b9195d2e777c0"
# scriptcode = bytes.fromhex(f"1976a914{keyhash}88ac")



# bip_143 = (
#     version
#     + hashPrevOut
#     + hashSequence
#     + outpoint
#     + scriptcode
#     + amount
#     + nsequence
#     + hashOutput
#     + nLockTime
#     + sighash
# )

# print(bip_143.hex())
# hashed_bip_143 = dSHA256(bip_143)

# print(hashed_bip_143.hex())

# # signature = signing_key.sign_digest(hashed_bip_143, sigencode=ecdsa.util.sigencode_der_canonize)
# signature_hex = "3044022100884219ecbb54a6ec4d09597ca6aca49692ded3c2ffb13d1858ca5b70e59fabb4021f2de73021471a01d8f03a71a923b662f00120d181d0f7fa8e06faa1bb750e8f01"
# public_key_hex = "0271d4e7a84804c075017593271c370e8983f704f123d22aa747cd321268981cba"

# # signature = bytes.fromhex(signature_hex)
# # public_key = bytes.fromhex(public_key_hex)

# # signature = "3044022100884219ecbb54a6ec4d09597ca6aca49692ded3c2ffb13d1858ca5b70e59fabb4021f2de73021471a01d8f03a71a923b662f00120d181d0f7fa8e06faa1bb750e8f01"
# # public_key = "0271d4e7a84804c075017593271c370e8983f704f123d22aa747cd321268981cba"

# signature = bytes.fromhex("3044022100884219ecbb54a6ec4d09597ca6aca49692ded3c2ffb13d1858ca5b70e59fabb4021f2de73021471a01d8f03a71a923b662f00120d181d0f7fa8e06faa1bb750e8f01")
# public_key = bytes.fromhex("0271d4e7a84804c075017593271c370e8983f704f123d22aa747cd321268981cba")
# # witness = (
# #     bytes.fromhex("02")
# #     + (len(signature)).to_bytes(1, byteorder="little", signed=False)
# #     + signature
# #     + bytes.fromhex("01")
# #     + (len(public_key)).to_bytes(1, byteorder="little", signed=False)
# #     + public_key
# # )

# witness = (
#     bytes.fromhex("02")
#     + (len(signature)).to_bytes(1, byteorder="little", signed=False)
#     + signature
#     # + bytes.fromhex("01")
#     + (len(public_key)).to_bytes(1, byteorder="little", signed=False)
#     + public_key
# )

# # siglen = (len(signature)).to_bytes(1, byteorder="little", signed=False)
# # print(siglen.hex())
# publen = (len(public_key)).to_bytes(1, byteorder="little", signed=False)

# # print(publen.hex())
# # print("====================")




# # redeemScript
# keyhash = ""
# redeemScript = bytes.fromhex(f"0014{keyhash}")
# redeemScriptFull = (
#     (len(redeemScript)+ 1).to_bytes(1, byteorder="little", signed=False)
#     + (len(redeemScript)).to_bytes(1, byteorder="little", signed=False)
#     + redeemScript
# )

# # tx in/out count
# tx_in_count = (1).to_bytes(1, byteorder="little", signed=False)
# tx_out_count = (1).to_bytes(1, byteorder="little", signed=False)


# # marker & flag

# marker = bytes.fromhex("00")
# flag = bytes.fromhex("01")

# final_tx = (
#     version
#     + marker
#     + flag
#     + tx_in_count
#     + outpoint
#     # + redeemScriptFull
#     + bytes.fromhex("00")
#     + sequence
#     + tx_out_count
#     + output
#     + witness
#     + nLockTime
# )

# # print(final_tx.hex())







# from ecdsa.util import sigdecode_der 
# from ecdsa import VerifyingKey, BadSignatureError

# def verify_signature(signature, public_key, sighash):
#     """Verify the ECDSA signature."""
#     try:
#         vk = VerifyingKey.from_string(bytes.fromhex(public_key), curve=ecdsa.SECP256k1)
#         # Make sure the signature is in bytes format and remove the sighash type byte if present
#         if isinstance(signature, str):
#             signature = bytes.fromhex(signature[:-2])  # Assuming the last byte is sighash type
#         # Verify the signature
#         result = vk.verify(signature, sighash, sigdecode=sigdecode_der)
#         print("Signature valid:", result)
#         return result
#     except BadSignatureError as e:
#         print("Signature verification failed:", e)
#         return False
#     except Exception as e:
#         print("An error occurred:", e)
#         return False


# signature_hex = '3044022100884219ecbb54a6ec4d09597ca6aca49692ded3c2ffb13d1858ca5b70e59fabb4021f2de73021471a01d8f03a71a923b662f00120d181d0f7fa8e06faa1bb750e8f01'
# # signature = bytes.fromhex(signature_hex[:-2])
# public_key = "0271d4e7a84804c075017593271c370e8983f704f123d22aa747cd321268981cba"
# sighash = bip_143
# # verify_signature("3044022100884219ecbb54a6ec4d09597ca6aca49692ded3c2ffb13d1858ca5b70e59fabb4021f2de73021471a01d8f03a71a923b662f00120d181d0f7fa8e06faa1bb750e8f01","0271d4e7a84804c075017593271c370e8983f704f123d22aa747cd321268981cba","8534893a473c10652c4b276b37f2aff5ec23b453e7487065e8165a23b04273a2")

# is_valid = verify_signature(signature_hex, public_key, sighash)
# # print("Signature valid:", is_valid)
