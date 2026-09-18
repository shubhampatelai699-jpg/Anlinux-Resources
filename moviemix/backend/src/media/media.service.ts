import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAsset } from './entities/media-asset.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly mediaRepo: Repository<MediaAsset>,
  ) {}

  async findOne(id: string) {
    const asset = await this.mediaRepo.findOne({
      where: { id },
      relations: ['videoAssets'],
    });
    if (!asset) throw new NotFoundException('Media asset not found');
    return { success: true, data: asset };
  }
}
