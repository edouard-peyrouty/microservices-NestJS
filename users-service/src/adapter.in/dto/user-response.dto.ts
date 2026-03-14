import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-1234' })
  id: string;

  @ApiProperty({ example: 'Edouard Peyrouty' })
  nom: string;

  @ApiProperty({ example: 'edouard@gmail.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}