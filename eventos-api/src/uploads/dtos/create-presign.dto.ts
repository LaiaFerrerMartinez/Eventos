import { IsString } from 'class-validator';
export class CreatePresignDto {
  @IsString() fileName: string;
  @IsString() contentType: string;
  @IsString() userId: string;
}
