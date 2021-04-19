package com.omega.cryptography

import com.omega.blockchain
import com.omega.models.Block
import com.omega.models.Transaction


fun Transaction.DocumentRequestTransaction.getDocumentBlock(): Block.DocumentBlock? {
    return blockchain.blocks.find {
        when (it) {
            is Block.DocumentBlock -> {
                it.documentId == documentId && it.clientHash == clientHash
            }
            is Block.TransactionBlock -> {
                false
            }
        }
    } as Block.DocumentBlock?
}