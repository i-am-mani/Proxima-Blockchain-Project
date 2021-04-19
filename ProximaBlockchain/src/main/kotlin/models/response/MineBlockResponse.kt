package com.omega.models.response

import com.omega.models.Block
import kotlinx.serialization.Serializable

@Serializable
data class MineBlockResponse(
    val isSuccess: Boolean,
    val documentNodes: List<Block.DocumentBlock>?,
    val reason: String?,
)
