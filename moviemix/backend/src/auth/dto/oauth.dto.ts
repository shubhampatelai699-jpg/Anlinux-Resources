import { IsString } from 'class-validator';

export class OAuthDto {
  @IsString()
  idToken: string;
}
