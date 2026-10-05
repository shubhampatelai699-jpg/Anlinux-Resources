import { IsString } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;
}
