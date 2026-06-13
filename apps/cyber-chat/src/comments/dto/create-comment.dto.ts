import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 30, { message: 'Der Autorenname muss zwischen 2 und 30 Zeichen lang sein.' })
    author: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 1000, { message: 'Der Kommentar darf nicht leer sein und maximal 1000 Zeichen lang sein.' })
    body: string;
}