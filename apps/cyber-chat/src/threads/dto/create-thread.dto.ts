import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, {
    message: 'Der Titel muss zwischen 3 und 50 Zeichen lang sein.',
  })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 2000, {
    message: 'Der Text muss zwischen 10 und 2000 Zeichen lang sein.',
  })
  body!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 30, {
    message: 'Der Autorenname muss zwischen 2 und 30 Zeichen lang sein.',
  })
  author!: string;
}
