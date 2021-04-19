package com.omega

import com.omega.cryptography.getPrivateKey
import com.omega.cryptography.getPublicKey
import java.lang.Byte.decode
import java.security.PublicKey
import java.security.Signature
import java.security.KeyFactory
import java.security.PrivateKey

import java.security.spec.X509EncodedKeySpec
import java.util.*
import java.security.KeyPair

import java.security.KeyPairGenerator
import java.security.spec.PKCS8EncodedKeySpec


fun main() {
    val signature = Signature.getInstance("SHA256WithRSA")
    val keyPairGenerator = KeyPairGenerator.getInstance("RSA")
    keyPairGenerator.initialize(1024)
    val keyPair = keyPairGenerator.generateKeyPair()

    val publicKey = keyPair.public.encoded
    val basePublicKey = Base64.getEncoder().encodeToString(publicKey)
    val basePrivateKey = Base64.getEncoder().encodeToString(keyPair.private.encoded)
    println("basePrivateKey")
    println(basePrivateKey)
    println("basePublicKey")
    println(basePublicKey)
    val signatureToCheck = Base64.getDecoder().decode("I3gFQuddXN0KNx3u1CJxby+IoWmwtVKqcwlhuehk3BEYPUDHNRNY9Z3XiWKWnPr1ALm1oZYMG980VgSe6QJXmhGn0rlUIo67Pc54z2cmcmMIL1ozX0UdeYX4ygaEcR01NoaDCaAosh/VOJ99KZrh1s2fhlQE5wLTw45c+itq3cA=")

//    print(basePrivateKey)
    val x509PublicKey = getPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXdCnOHe2XSgSPsrJo4NxqMF4iC/reoVhHsikVX+FuZLVLRkpJHpGq5t6ePSWIHUHthy8NphpjzCApudUrXjdAei2w1f3Q1QSh5gzI+6GQwGCzyI4IVVKq4UamjmWChmY3iO9WIwVWsqnXH8h3C8Q5w8HqHYNcAs2lli09v0mOuwIDAQAB")
    val pkcsPrivateKey = getPrivateKey(basePrivateKey)
//    println(Base64.getEncoder().encodeToString(pkcsPrivateKey!!.encoded))
//    val byteArray = "Hellow orld".toByteArray(charset("utf-8"))
//    signature.initSign(pkcsPrivateKey)
//    signature.update(byteArray)
//    val sign = signature.sign()
//    println("Signature = $sign")
//
    val verifySignature = Signature.getInstance("SHA256withRSA")
//    val faultyByteArray= "Hello w orld".toByteArray(charset("utf-8"))
    verifySignature.initVerify(x509PublicKey)
    verifySignature.update("hola".toByteArray(charset("utf-8")))
    val verify = verifySignature.verify(signatureToCheck)
    print("Signature Verification = $verify")
}
