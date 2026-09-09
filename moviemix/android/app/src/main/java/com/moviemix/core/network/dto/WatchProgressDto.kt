package com.moviemix.core.network.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WatchProgressResponse(
    val success: Boolean,
    val data: WatchProgressDto? = null,
)

@Serializable
data class WatchProgressDto(
    @SerialName("contentType") val contentType: String,
    @SerialName("contentId") val contentId: String,
    @SerialName("positionSeconds") val positionSeconds: Int,
    @SerialName("durationSeconds") val durationSeconds: Int,
    val percentage: Double,
    val completed: Boolean,
    @SerialName("lastWatchedAt") val lastWatchedAt: String,
)

@Serializable
data class WatchProgressRequest(
    @SerialName("positionSeconds") val positionSeconds: Int,
    @SerialName("durationSeconds") val durationSeconds: Int,
)
