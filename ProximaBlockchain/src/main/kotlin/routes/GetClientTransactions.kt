package com.omega.routes

import com.omega.blockchain
import com.omega.models.Block
import com.omega.models.Transaction
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.request.receive
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.routing
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class ClientTransactionRequest(
    val clientHash: String
)

@Serializable
data class ClientTransactionResponse(
    val clientHash: String,
    val listOfTransaction: List<Transaction>
)

fun Application.getClientTransactions() {

    routing {
        /**
         * Accepts clientHash (unique public address) in post parameter.
         *
         * and returns entire transaction history
         */
        post("/get_transactions") {
            val clientRequest = call.receive<ClientTransactionRequest>()
            val clientHash = clientRequest.clientHash
            val mutableListOfTransactions = mutableListOf<Transaction>()
            blockchain.blocks.forEach { block ->
                when (block) {
                    is Block.TransactionBlock -> {
                        val filter = block.transactions.filter { transaction ->
                            when (transaction) {
                                is Transaction.DocumentRequestTransaction -> {
                                    return@filter false
                                }
                                is Transaction.LoanTransaction -> {
                                    return@filter transaction.clientHash == clientHash
                                }
                            }
                        }
                        mutableListOfTransactions.addAll(filter)
                    }
                    else -> null
                }
            }

            call.respondText(
                Json.encodeToString(
                    ClientTransactionResponse(clientHash, mutableListOfTransactions)
                )
            )

        }
    }

}