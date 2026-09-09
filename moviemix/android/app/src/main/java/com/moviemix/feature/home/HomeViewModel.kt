package com.moviemix.feature.home

import androidx.lifecycle.ViewModel
import com.moviemix.core.network.MovieMixApi
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val api: MovieMixApi,
) : ViewModel() {
    // TODO: load home feed and expose UI state
}
