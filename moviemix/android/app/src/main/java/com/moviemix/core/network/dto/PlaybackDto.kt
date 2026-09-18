package com.moviemix.core.network.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class PlaybackSessionRequest(
    @SerialName("contentType") val contentType: String,
    @SerialName("contentId") val contentId: String,
    val quality: String = "AUTO",
    @SerialName("audioLanguage") val audioLanguage: String? = null,
    @SerialName("subtitleLanguage") val subtitleLanguage: String? = null,
)

@Serializable
data class PlaybackSessionResponse(
    val success: Boolean,
    val data: PlaybackSessionData? = null,
)

@Serializable
data class PlaybackSessionData(
    @SerialName("sessionId") val sessionId: String,
    val protocol: String,
    @SerialName("manifestUrl") val manifestUrl: String,
    @SerialName("expiresAt") val expiresAt: String,
    @SerialName("audioTracks") val audioTracks: List<TrackDto> = emptyList(),
    val subtitles: List<TrackDto> = emptyList(),
)

@Serializable
data class TrackDto(
    @SerialName("languageCode") val languageCode: String,
    val label: String,
    @SerialName("isDefault") val isDefault: Boolean = false,
)
