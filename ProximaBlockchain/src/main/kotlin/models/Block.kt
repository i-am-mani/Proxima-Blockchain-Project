package com.omega.models

import kotlinx.serialization.Serializable
import java.util.*

@Serializable
sealed class Block {

    @Serializable
    data class DocumentBlock(
        var header: Header,
        // Later used by Nodes to request document from bank (matching hash)
        var documentId: String,

        // Unique 20 byte hash
        var documentHash: String,

        // public key of the user - uniquely identifies a user
        var clientHash: String,

        // public key of the bank - uniquely identifies a bank in consortium
        var bankHash: String,

        // Signed by the bank through its private key: non-repudiation and verification.
        // Signature = clientHash + bankHash + documentHash + documentId
        var bankSignature: String,

        // Signed by the Client: Non-Repudiation
        // Signature = clientHash + bankHash + documentHash + documentId ( + Private Key of Client for encryption )
        var clientSignature: String,
    ): Block()

    @Serializable
    data class TransactionBlock(
        var header: Header,
        var transactions: List<Transaction>
    ): Block()
}
