package com.moviemix.core.network.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MovieListResponse(
    val success: Boolean,
    val data: ContentListData? = null,
)

@Serializable
data class ContentListData(
    val items: List<ContentDto> = emptyList(),
    val total: Int = 0,
    val page: Int = 1,
    val limit: Int = 20,
)

@Serializable
data class MovieDetailResponse(
    val success: Boolean,
    val data: ContentDto? = null,
)
