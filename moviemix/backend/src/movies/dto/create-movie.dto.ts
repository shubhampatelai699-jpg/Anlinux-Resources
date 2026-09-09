import { IsString, IsOptional, IsInt, IsNumber, IsArray, IsEnum } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  releaseDate?: string;

  @IsOptional()
  @IsInt()
  runtimeSeconds?: number;

  @IsOptional()
  @IsString()
  ageRating?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  contentTier?: string;

  @IsOptional()
  @IsArray()
  genreIds?: string[];
}
