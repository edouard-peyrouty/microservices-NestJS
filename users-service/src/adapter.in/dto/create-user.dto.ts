import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Edouard Peyrouty' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'edouard@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  role: string;
}