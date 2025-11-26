import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { CreatePresignDto } from './dtos/create-presign.dto';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly s: UploadsService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Genera URL presignada para subida directa a S3' })
  presign(@Body() dto: CreatePresignDto) {
    return this.s.presign(dto.fileName, dto.contentType, dto.userId);
  }
}
