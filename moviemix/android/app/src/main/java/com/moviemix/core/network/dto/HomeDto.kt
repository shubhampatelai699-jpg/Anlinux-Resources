package com.moviemix.core.network.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class HomeResponse(
    val success: Boolean,
    val data: HomeData? = null,
)

@Serializable
data class HomeData(
    val hero: List<ContentDto> = emptyList(),
    @SerialName("continueWatching") val continueWatching: List<ContinueWatchingDto> = emptyList(),
    val trending: List<ContentDto> = emptyList(),
    @SerialName("newReleases") val newReleases: List<ContentDto> = emptyList(),
    val popular: List<ContentDto> = emptyList(),
    val genres: List<GenreDto> = emptyList(),
)

@Serializable
data class ContentDto(
    val id: String,
    val type: String,
    val title: String,
    val slug: String,
    val description: String? = null,
    @SerialName("releaseDate") val releaseDate: String? = null,
    @SerialName("runtimeSeconds") val runtimeSeconds: Int? = null,
    @SerialName("ageRating") val ageRating: String? = null,
    val rating: Double? = null,
    val poster: MediaAssetDto? = null,
    val backdrop: MediaAssetDto? = null,
    val genres: List<GenreDto> = emptyList(),
)

@Serializable
data class ContinueWatchingDto(
    @SerialName("contentType") val contentType: String,
    @SerialName("contentId") val contentId: String,
    val title: String,
    val poster: MediaAssetDto? = null,
    @SerialName("positionSeconds") val positionSeconds: Int,
    @SerialName("durationSeconds") val durationSeconds: Int,
    val percentage: Double,
)

@Serializable
data class GenreDto(
    val id: String,
    val name: String,
    val slug: String,
)

@Serializable
data class MediaAssetDto(
    val id: String,
    @SerialName("contentType") val contentType: String,
    val url: String,
    val width: Int? = null,
    val height: Int? = null,
    val language: String? = null,
)
