import { IsEnum, IsUUID } from 'class-validator';

export class WatchlistItemDto {
  @IsEnum(['MOVIE', 'SERIES'])
  contentType: string;

  @IsUUID()
  contentId: string;
}
