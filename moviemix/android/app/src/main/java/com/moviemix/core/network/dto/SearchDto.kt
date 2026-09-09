package com.moviemix.core.network.dto

import kotlinx.serialization.Serializable

@Serializable
data class SearchResponse(
    val success: Boolean,
    val data: SearchData? = null,
)

@Serializable
data class SearchData(
    val movies: List<ContentDto> = emptyList(),
    val series: List<ContentDto> = emptyList(),
    val total: Int = 0,
)
