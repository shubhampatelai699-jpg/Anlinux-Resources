import { IsInt, Min } from 'class-validator';

export class WatchProgressDto {
  @IsInt()
  @Min(0)
  positionSeconds: number;

  @IsInt()
  @Min(1)
  durationSeconds: number;
}
