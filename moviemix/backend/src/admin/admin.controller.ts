import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async dashboard() {
    return this.adminService.dashboard();
  }

  @Get('analytics')
  async analytics() {
    return this.adminService.analytics();
  }

  @Post('movies/:id/publish')
  async publishMovie(@Param('id') id: string) {
    return this.adminService.publishMovie(id);
  }

  @Post('movies/:id/unpublish')
  async unpublishMovie(@Param('id') id: string) {
    return this.adminService.unpublishMovie(id);
  }

  @Post('episodes/:id/publish')
  async publishEpisode(@Param('id') id: string) {
    return this.adminService.publishEpisode(id);
  }
}
