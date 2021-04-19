package com.omega.models

import kotlinx.serialization.Serializable

@Serializable
data class Header(
    var version: String,
    var previousBlockHash: String,
    var timestamp: Long
)
