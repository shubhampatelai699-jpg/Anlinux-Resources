import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateSeriesDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @IsUrl()
  @IsOptional()
  backdropUrl?: string;

  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  @IsNumber()
  @IsOptional()
  releaseYear?: number;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  languageCode?: string;

  @IsString()
  @IsOptional()
  status?: 'draft' | 'published' | 'archived';

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genreIds?: string[];
}

export class CreateSeasonDto {
  @IsNumber()
  seasonNumber!: number;

  @IsString()
  @IsOptional()
  title?: string;
}

export class CreateEpisodeDto {
  @IsNumber()
  episodeNumber!: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsNumber()
  @IsOptional()
  durationSeconds?: number;

  @IsString()
  @IsOptional()
  videoAssetId?: string;

  @IsUrl()
  @IsOptional()
  hlsManifestUrl?: string;
}
