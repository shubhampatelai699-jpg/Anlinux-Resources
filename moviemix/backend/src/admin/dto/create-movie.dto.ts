import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMovieDto {
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
  runtimeMinutes?: number;

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

  @IsString()
  @IsOptional()
  videoAssetId?: string;

  @IsUrl()
  @IsOptional()
  hlsManifestUrl?: string;

  @IsBoolean()
  @IsOptional()
  drmRequired?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genreIds?: string[];
}
