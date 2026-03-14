import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Edouard Peyrouty' })
  @IsString()
  @IsOptional()
  nom?: string;

  @ApiPropertyOptional({ example: 'edouard@gmail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'admin' })
  @IsString()
  @IsOptional()
  role?: string;
}