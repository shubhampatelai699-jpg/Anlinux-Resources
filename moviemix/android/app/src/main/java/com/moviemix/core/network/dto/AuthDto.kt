package com.moviemix.core.network.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val email: String,
    val password: String,
)

@Serializable
data class AuthResponse(
    val success: Boolean,
    val data: AuthData? = null,
)

@Serializable
data class AuthData(
    val user: UserDto,
    @SerialName("accessToken") val accessToken: String,
    @SerialName("refreshToken") val refreshToken: String,
)

@Serializable
data class UserDto(
    val id: String,
    @SerialName("displayName") val displayName: String?,
    val email: String,
    val role: String,
)
