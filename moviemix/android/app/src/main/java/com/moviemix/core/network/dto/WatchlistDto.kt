package com.moviemix.core.network.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WatchlistResponse(
    val success: Boolean,
    val data: List<WatchlistItemDto> = emptyList(),
)

@Serializable
data class WatchlistItemDto(
    @SerialName("contentType") val contentType: String,
    @SerialName("contentId") val contentId: String,
    val title: String,
    val poster: MediaAssetDto? = null,
    @SerialName("addedAt") val addedAt: String? = null,
)

@Serializable
data class WatchlistItemRequest(
    @SerialName("contentType") val contentType: String,
    @SerialName("contentId") val contentId: String,
)
