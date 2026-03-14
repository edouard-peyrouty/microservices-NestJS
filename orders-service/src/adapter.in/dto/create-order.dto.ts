import { IsString, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import e from 'express';

export class CreateOrderDto {
  @ApiProperty({ example: 'user-12345' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: ['product-12345', 'product-67890'] })
  @IsArray()
  @IsNotEmpty()
  products: string[];
}