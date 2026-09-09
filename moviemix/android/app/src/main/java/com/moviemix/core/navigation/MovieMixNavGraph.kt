package com.moviemix.core.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.moviemix.feature.auth.LoginScreen
import com.moviemix.feature.home.HomeScreen
import com.moviemix.feature.splash.SplashScreen

object MovieMixRoutes {
    const val Splash = "splash"
    const val Login = "login"
    const val Home = "home"
    const val Search = "search"
    const val Library = "library"
    const val Profile = "profile"
    const val MovieDetails = "movie/{id}"
    const val SeriesDetails = "series/{id}"
    const val Player = "player/{contentType}/{contentId}"
}

@Composable
fun MovieMixNavGraph(
    navController: NavHostController = rememberNavController(),
    startDestination: String = MovieMixRoutes.Splash,
) {
    NavHost(navController = navController, startDestination = startDestination) {
        composable(MovieMixRoutes.Splash) {
            SplashScreen(
                onAuthenticated = { navController.navigate(MovieMixRoutes.Home) { popUpTo(0) } },
                onUnauthenticated = { navController.navigate(MovieMixRoutes.Login) { popUpTo(0) } },
            )
        }
        composable(MovieMixRoutes.Login) {
            LoginScreen(
                onLoginSuccess = { navController.navigate(MovieMixRoutes.Home) { popUpTo(0) } },
            )
        }
        composable(MovieMixRoutes.Home) {
            HomeScreen()
        }
    }
}
