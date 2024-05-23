import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseType {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjY0ZmFiYTFjZjMzYjRiNjFmNTFhNzg1IiwiaWF0IjoxNzE2NTAwMDc5LCJleHAiOjE3MTY1MDA5Nzl9.9kf66lbSTDopPDk7p_hIzjEW0OmJvBkl3oZSQaoWmwY',
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjY0ZmFiYTFjZjMzYjRiNjFmNTFhNzg1IiwiaWF0IjoxNzE2NTAwMDc5LCJleHAiOjE3MTcxMDQ4Nzl9.ThjqTM4TSYK2vIlKTT19rooDuXVYwWqbu6VNR26s_P4',
    description: 'Refresh token',
  })
  refreshToken: string;
}
