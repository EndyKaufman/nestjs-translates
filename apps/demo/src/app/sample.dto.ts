import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator-multi-lang';

export class SampleDto {
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email!: string;

  @IsNotEmpty()
  @Expose()
  password!: string;
}
