package com.moviemix.core.network

import com.moviemix.core.network.dto.AuthResponse
import com.moviemix.core.network.dto.HomeResponse
import com.moviemix.core.network.dto.LoginRequest
import com.moviemix.core.network.dto.MovieDetailResponse
import com.moviemix.core.network.dto.MovieListResponse
import com.moviemix.core.network.dto.PlaybackSessionRequest
import com.moviemix.core.network.dto.PlaybackSessionResponse
import com.moviemix.core.network.dto.SearchResponse
import com.moviemix.core.network.dto.WatchHistoryResponse
import com.moviemix.core.network.dto.WatchlistItemRequest
import com.moviemix.core.network.dto.WatchlistResponse
import com.moviemix.core.network.dto.WatchProgressRequest
import com.moviemix.core.network.dto.WatchProgressResponse
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface MovieMixApi {

    @POST("auth/register")
    suspend fun register(@Body request: LoginRequest): AuthResponse

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @GET("auth/me")
    suspend fun me(): AuthResponse

    @GET("home")
    suspend fun home(): HomeResponse

    @GET("movies")
    suspend fun movies(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
    ): MovieListResponse

    @GET("movies/{id}")
    suspend fun movie(@Path("id") id: String): MovieDetailResponse

    @GET("series")
    suspend fun series(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
    ): MovieListResponse

    @GET("search")
    suspend fun search(
        @Query("q") query: String,
        @Query("page") page: Int = 1,
    ): SearchResponse

    @GET("watchlist")
    suspend fun watchlist(): WatchlistResponse

    @POST("watchlist")
    suspend fun addToWatchlist(@Body request: WatchlistItemRequest)

    @DELETE("watchlist/{contentType}/{contentId}")
    suspend fun removeFromWatchlist(
        @Path("contentType") contentType: String,
        @Path("contentId") contentId: String,
    )

    @GET("watch-history")
    suspend fun watchHistory(): WatchHistoryResponse

    @GET("watch-progress/{contentType}/{contentId}")
    suspend fun watchProgress(
        @Path("contentType") contentType: String,
        @Path("contentId") contentId: String,
    ): WatchProgressResponse

    @PUT("watch-progress/{contentType}/{contentId}")
    suspend fun updateWatchProgress(
        @Path("contentType") contentType: String,
        @Path("contentId") contentId: String,
        @Body request: WatchProgressRequest,
    ): WatchProgressResponse

    @POST("playback/session")
    suspend fun createPlaybackSession(
        @Body request: PlaybackSessionRequest,
    ): PlaybackSessionResponse
}
