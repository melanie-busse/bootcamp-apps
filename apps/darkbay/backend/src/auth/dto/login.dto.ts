import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'Benutzername darf nicht leer sein.' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Passwort darf nicht leer sein.' })
    password: string;
}