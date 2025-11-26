import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleFavoritoDto {
  @ApiProperty()
  @IsInt()
  id_evento: number;
}
