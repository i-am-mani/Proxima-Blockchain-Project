package com.omega.routes

import com.omega.PeerNodes
import com.omega.blockchain
import com.omega.cryptography.getDocumentBlock
import com.omega.cryptography.isSignaturesValid
import com.omega.exceptions.NonExistingDocumentRequest
import com.omega.models.Block
import com.omega.models.Blockchain
import com.omega.models.Transaction
import com.omega.models.response.MineBlockResponse
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.get
import io.ktor.client.request.HttpResponseData
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.request.receiveText
import io.ktor.response.respond
import io.ktor.routing.post
import io.ktor.routing.routing
import io.netty.handler.codec.http.HttpResponse
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.lang.Exception

/**
 * Adds a new block of either Document or Transaction Type after, Verifying the signatures.
 *
 * Before adding node to the current blockchain,
 * - It queries all the peers for their blockchain
 * - Chooses and replaces its blockchain with, the blockchain with largest length
 * - Update the blockchain with new node
 * - Returns Document Blocks if present in the transactions
 * - Broadcast new node to all the peers
 *
 * Expects to be in defined format of document/transaction data model
 */
fun Application.mineRoute() {

    routing {
        post("/mine") {
            // Connect with peers a update the current blockchain to longest available
            updateBlockchainFromPeers()

            // verify the signatures and add to the blockchain
            val message = call.receiveText()
            println(message)
            val block = Json.decodeFromString<Block>(message)
            println(block)
            val documentBlocks = mutableListOf<Block.DocumentBlock>()
            try {
                block.isSignaturesValid()
                when (block) {
                    is Block.DocumentBlock -> {
                        addBlockToBlockchain(block)
                    }

                    is Block.TransactionBlock -> {
                        block.transactions.map { transaction ->
                            when (transaction) {
                                is Transaction.DocumentRequestTransaction -> {
                                    val docBlock = transaction.getDocumentBlock()
                                    if (docBlock != null) {
                                        documentBlocks.add(docBlock)
                                    } else {
                                        throw NonExistingDocumentRequest()
                                    }

                                }
                                is Transaction.LoanTransaction -> {
                                }
                            }

                        }
                        addBlockToBlockchain(block)
                    }
                }
            } catch (e: Exception) {
                val successResponse = MineBlockResponse(false, null, e.message)
                call.respond(successResponse)
            }
            val successResponse = MineBlockResponse(true, documentBlocks, null)
            call.respond(successResponse)
        }
    }
}

suspend fun updateBlockchainFromPeers() {
    val client = HttpClient(CIO)
    for (peer in PeerNodes) {
        try {
            val peerBlockchainText: String = client.get("${peer.url}/get_blockchain")
            val peerBlockchain = Json.decodeFromString<Blockchain>(peerBlockchainText)
            if (peerBlockchain.blocks.size > blockchain.blocks.size) {
                blockchain = peerBlockchain
                replaceBlockchain()
                println("Blockchain Replaced Successfully")
            }
        } catch (e: Exception) {
            print("Client $peer Is Offline ${e.message}")
        }
    }
}

suspend fun addBlockToBlockchain(block: Block) {
    blockchain.blocks.add(block)
    replaceBlockchain()
    broadcastNodes()
}

fun replaceBlockchain() {
    val file = File("./blockchain.json")
    val encodedString = Json.encodeToString(blockchain)
    file.writeText(encodedString)
}

internal suspend fun broadcastNodes() {
    val client = HttpClient(CIO)
    PeerNodes.forEach {
        try {
            client.post("${it.url}/broadcast_receiver") {
                body = Json.encodeToString(blockchain)
            }
        } catch (e: Exception) {
            print("Client $it Is Offline ${e.message}")
        }
    }

}