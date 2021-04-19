package com.omega.cryptography

import com.omega.exceptions.InvalidDocumentBankSignature
import com.omega.exceptions.InvalidDocumentClientSignature
import com.omega.exceptions.InvalidTransactionBlockSignatures
import com.omega.exceptions.MissingRequiredFields
import com.omega.models.Block
import com.omega.models.Transaction
import java.security.KeyFactory
import java.security.PrivateKey
import java.security.PublicKey
import java.security.Signature
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import java.util.*

fun Block.isSignaturesValid() {
    when (this) {
        is Block.DocumentBlock -> {

            if (bankHash.isEmpty() || clientHash.isEmpty() || documentId.isEmpty() || bankSignature.isEmpty()) {
                throw MissingRequiredFields()
            }

            // Client verification - proves client actually consented
            val clientSignatureMessage = "${bankHash}|${clientHash}|${documentId}"
//            val isClientSignatureValid = verifySignature(clientSignatureMessage, clientSignature, clientHash)

            // Bank Verification - proves bank actually requested
            val bankSignatureMessage = "${bankHash}|${clientHash}|${documentId}"
            val isBankSignatureValid = verifySignature(bankSignatureMessage, bankSignature, bankHash)

//            if (!isClientSignatureValid) {
//                throw InvalidDocumentClientSignature()
//            }
            if (!isBankSignatureValid) {
                throw InvalidDocumentBankSignature()
            }
        }
        is Block.TransactionBlock -> {
            var isTransactionBlockValid = true
            for (transaction in transactions) {
                when (transaction) {
                    is Transaction.LoanTransaction -> {
                        val message = "${transaction.bankHash}|${transaction.clientHash}|${transaction.amount}"
                        val isValid = verifySignature(message, transaction.bankSignature, transaction.bankHash)
                        if (!isValid) {
                            throw InvalidTransactionBlockSignatures()
                        }
                    }
                    is Transaction.DocumentRequestTransaction -> {
                        val message = "${transaction.bankHash}|${transaction.clientHash}|${transaction.documentId}"
                        val isClientValid =
                            verifySignature(message, transaction.clientSignature, transaction.clientHash)
                        val isBankValid = verifySignature(message, transaction.bankSignature, transaction.bankHash)
                        if (!isBankValid || !isClientValid) {
                            throw InvalidTransactionBlockSignatures()
                        }
                    }
                }
            }
        }
    }
}

/**
 * originalSignature is of type Base64
 */
fun verifySignature(message: String, originalSignature: String, publicKey: String): Boolean {
    val signature = Signature.getInstance("SHA256withRSA")
    val messageByteArray = message.toByteArray(charset("utf-8"))
    val signatureByteArray = Base64.getDecoder().decode(
        originalSignature
    )
    val x509PublicKey = getPublicKey(publicKey)

    signature.apply {
        initVerify(x509PublicKey)
        update(messageByteArray)
    }

    val verify = signature.verify(signatureByteArray)
    return verify
}

fun getPublicKey(key: String): PublicKey? {
    try {
        val byteKey: ByteArray = Base64.getDecoder().decode(key.toByteArray())
        val x509EncodedKeySpec = X509EncodedKeySpec(byteKey)
        val kf = KeyFactory.getInstance("RSA")
        return kf.generatePublic(x509EncodedKeySpec)
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return null
}

fun getPrivateKey(key: String): PrivateKey? {
    try {
        val byteKey: ByteArray = Base64.getDecoder().decode(key.toByteArray())
        val keySpec = PKCS8EncodedKeySpec(byteKey)
        val kf = KeyFactory.getInstance("RSA")
        return kf.generatePrivate(keySpec)
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return null
}