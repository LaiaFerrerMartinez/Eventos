import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Cloud' })
  @IsString()
  @IsNotEmpty()
  nombre_categoria: string;

  @ApiProperty({ required: false, example: 'icons/cloud.png' })
  @IsOptional()
  @IsString()
  img_categoria?: string;
}
