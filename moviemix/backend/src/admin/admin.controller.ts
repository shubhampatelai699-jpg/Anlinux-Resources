import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateSeriesDto, CreateSeasonDto, CreateEpisodeDto } from './dto/create-series.dto';
import { CreateGenreDto } from './dto/create-genre.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('movies')
  listMovies() {
    return this.admin.listMovies();
  }

  @Post('movies')
  createMovie(@Body() body: CreateMovieDto) {
    return this.admin.createMovie(body);
  }

  @Patch('movies/:id')
  updateMovie(@Param('id') id: string, @Body() body: CreateMovieDto) {
    return this.admin.updateMovie(id, body);
  }

  @Delete('movies/:id')
  deleteMovie(@Param('id') id: string) {
    return this.admin.deleteMovie(id);
  }

  @Get('series')
  listSeries() {
    return this.admin.listSeries();
  }

  @Post('series')
  createSeries(@Body() body: CreateSeriesDto) {
    return this.admin.createSeries(body);
  }

  @Post('series/:id/seasons')
  createSeason(@Param('id') id: string, @Body() body: CreateSeasonDto) {
    return this.admin.createSeason(id, body);
  }

  @Post('seasons/:id/episodes')
  createEpisode(@Param('id') id: string, @Body() body: CreateEpisodeDto) {
    return this.admin.createEpisode(id, body);
  }

  @Get('genres')
  listGenres() {
    return this.admin.listGenres();
  }

  @Post('genres')
  createGenre(@Body() body: CreateGenreDto) {
    return this.admin.createGenre(body.name, body.slug);
  }

  @Get('users')
  listUsers() {
    return this.admin.listUsers();
  }

  @Patch('users/:id/role')
  setRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.admin.setUserRole(id, body.role);
  }
}
