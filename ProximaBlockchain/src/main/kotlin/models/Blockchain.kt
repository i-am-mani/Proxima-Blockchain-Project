package com.omega.models

import kotlinx.serialization.Serializable

@Serializable
data class Blockchain(
    var blocks: MutableList<Block>
)