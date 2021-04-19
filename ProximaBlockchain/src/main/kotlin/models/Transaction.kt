package com.omega.models

import kotlinx.serialization.Serializable

@Serializable
sealed class Transaction {

    @Serializable
    data class LoanTransaction(
        var transactionType: String,
        var bankHash: String,
        var clientHash: String,
        var amount: Long,
        val bankSignature: String // Since Bank is the one granting loan
    ) : Transaction()

    @Serializable
    data class DocumentRequestTransaction(
        var bankHash: String,
        var clientHash: String,
        var documentId: String,
        // Signature = bankHash + clientHash + documentId
        var bankSignature: String, // - To prevent Non-Repudiation Case
        var clientSignature: String, // -  To Prevent Bank from Access without consent
    ) : Transaction()
}