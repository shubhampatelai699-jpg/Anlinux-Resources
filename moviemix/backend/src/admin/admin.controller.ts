import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';

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

  @Post('movies')
  createMovie(@Body() body: any) {
    return this.admin.createMovie(body);
  }

  @Patch('movies/:id')
  updateMovie(@Param('id') id: string, @Body() body: any) {
    return this.admin.updateMovie(id, body);
  }

  @Delete('movies/:id')
  deleteMovie(@Param('id') id: string) {
    return this.admin.deleteMovie(id);
  }

  @Post('series')
  createSeries(@Body() body: any) {
    return this.admin.createSeries(body);
  }

  @Post('series/:id/seasons')
  createSeason(@Param('id') id: string, @Body() body: any) {
    return this.admin.createSeason(id, body);
  }

  @Post('seasons/:id/episodes')
  createEpisode(@Param('id') id: string, @Body() body: any) {
    return this.admin.createEpisode(id, body);
  }

  @Post('genres')
  createGenre(@Body() body: { name: string; slug: string }) {
    return this.admin.createGenre(body.name, body.slug);
  }

  @Patch('users/:id/role')
  setRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.admin.setUserRole(id, body.role);
  }
}
