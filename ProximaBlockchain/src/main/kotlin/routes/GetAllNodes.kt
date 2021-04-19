package com.omega.routes

import com.omega.blockchain
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.encodeToJsonElement

/**
 * Returns current blockchain copy
 *
 * Serialize the blockchain to string(JSON) and return the output as response.
 */
fun Application.getAllNodes() {

    routing {

        get("/get_blockchain") {
            call.respondText(Json.encodeToString(blockchain))
        }
    }

}