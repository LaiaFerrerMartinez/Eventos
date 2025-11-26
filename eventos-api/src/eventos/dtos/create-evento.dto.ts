import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsInt, Min, Max, IsOptional, IsArray,
  ArrayNotEmpty, IsUrl, IsNotEmpty, Matches
} from 'class-validator';

export class CreateEventoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  puntuacion: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: '31/12/2025' })
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'fecha debe ser dd/mm/aaaa' })
  fecha: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' })
  @IsString()
  @IsUrl()
  @Matches(/(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/i, { message: 'video debe ser URL de YouTube' })
  video: string;

  @ApiProperty({ description: 'S3 key devuelta por presign' })
  @IsString()
  @IsNotEmpty()
  img_evento: string;

  @ApiProperty()
  @IsInt()
  id_usuario: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  categorias: number[];
}
