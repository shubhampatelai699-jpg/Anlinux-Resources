import { IsEnum, IsUUID, IsOptional, IsString } from 'class-validator';

export class PlaybackSessionDto {
  @IsEnum(['MOVIE', 'EPISODE'])
  contentType: string;

  @IsUUID()
  contentId: string;

  @IsOptional()
  @IsString()
  quality?: string;

  @IsOptional()
  @IsString()
  audioLanguage?: string;

  @IsOptional()
  @IsString()
  subtitleLanguage?: string;
}
