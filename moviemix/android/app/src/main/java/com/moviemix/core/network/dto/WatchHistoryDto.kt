package com.moviemix.core.network.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WatchHistoryResponse(
    val success: Boolean,
    val data: WatchHistoryData? = null,
)

@Serializable
data class WatchHistoryData(
    val items: List<WatchHistoryItemDto> = emptyList(),
    val total: Int = 0,
    val page: Int = 1,
    val limit: Int = 20,
)

@Serializable
data class WatchHistoryItemDto(
    @SerialName("contentType") val contentType: String,
    @SerialName("contentId") val contentId: String,
    val title: String,
    val completed: Boolean,
    @SerialName("watchedAt") val watchedAt: String,
)
