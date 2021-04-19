package com.omega

import com.omega.models.Block
import com.omega.models.Blockchain
import com.omega.models.Peer
import com.omega.routes.*
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.features.ContentNegotiation
import io.ktor.request.receive
import io.ktor.request.receiveText
import io.ktor.routing.post
import io.ktor.routing.routing
import io.ktor.serialization.json
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.nio.file.Files
import java.io.IOException

import java.io.FileWriter

import java.io.BufferedWriter
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.io.path.ExperimentalPathApi
import kotlin.io.path.writeText


fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)


var PeerNodes = listOf(Peer("http://0.0.0.0:8080"), Peer("http://0.0.0.0:8081"))

var blockchain = Blockchain(mutableListOf())

@ExperimentalPathApi
@Suppress("unused")
fun Application.module() {
    install(ContentNegotiation) {
        json()
    }

    launch {
        updateBlockchainFromPeers()
    }

    try {
        val file = File("./blockchain.json")
        val jsonString = file.readText()
        blockchain = Json.decodeFromString(jsonString)
    } catch (e: Exception) {
        val createFile = Files.createFile(Paths.get("./blockchain.json"))
        createFile.writeText(Json.encodeToString(Blockchain(mutableListOf())))
    }

    mineRoute()
    getClientTransactions()
    getAllNodes()
    broadcastReceiver()
    routing {
        post("/peer") {
            val message = call.receiveText()
            println(message)
            val decodedObject = Json.decodeFromString<Block>(message)
            println(decodedObject)
        }
    }

}

//fun main() {
//    val sampleHash = Integer.toHexString(34)
//    val header = Header("0.0.1", sampleHash, System.currentTimeMillis())
//    val dblock = Block.DocumentBlock(header, "001", sampleHash, sampleHash, sampleHash, sampleHash, sampleHash)
//    val transactions = Transaction.LoanTransaction(sampleHash, sampleHash, 230.0, sampleHash)
//    val tblock = Block.TransactionBlock(header, listOf(transactions))
//
//    val blockchain = Blockchain(listOf<Block>(dblock, tblock))
//    val file = File("./text.json")
//    val jsonString = file.readText()
////    val encodedString = Json.encodeToString(blockchain)
////    file.writeText(encodedString)
//    val decode = Json.decodeFromString<Blockchain>(jsonString)
//    print(decode.toString())
//}