package com.omega.routes

import com.omega.blockchain
import com.omega.models.Block
import com.omega.models.Blockchain
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.request.receive
import io.ktor.request.receiveText
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.routing
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

fun Application.broadcastReceiver() {

    routing {
        /**
         * A hook which will be called by the peers whenever new block is added.
         *
         * No Verification done at this phase if the Node is coming from authority Node
         * i.e Node owned by Bank
         *
         * Expects a `Block` in Post body in JSON format.
         */
        post("/broadcast_receiver") {
            val peerBlockchainText = call.receiveText()
            val peerBlockchain = Json.decodeFromString<Blockchain>(peerBlockchainText)
            print("Received new blockchain of length ${peerBlockchain.blocks.size}")
            if (blockchain.blocks.size < peerBlockchain.blocks.size) {
                blockchain = peerBlockchain
                replaceBlockchain()
                println("Blockchain Replaced")
            }
        }
    }

}