import { Controller, Get, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@CurrentUser('userId') userId: string) {
    return this.homeService.getHome(userId);
  }

  @Get('trending')
  async trending() {
    return this.homeService.trending();
  }

  @Get('popular')
  async popular() {
    return this.homeService.popular();
  }

  @Get('new-releases')
  async newReleases() {
    return this.homeService.newReleases();
  }

  @Get('genres')
  async genres() {
    return this.homeService.genres();
  }

  @Get('continue-watching')
  @UseGuards(JwtAuthGuard)
  async continueWatching(@CurrentUser('userId') userId: string) {
    return this.homeService.continueWatching(userId);
  }
}
