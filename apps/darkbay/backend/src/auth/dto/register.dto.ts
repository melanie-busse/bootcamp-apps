import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(3, { message: 'Der Benutzername muss mindestens 3 Zeichen lang sein.' })
    @MaxLength(30, { message: 'Der Benutzername darf maximal 30 Zeichen lang sein.' })
    username: string;

    @IsString()
    @MinLength(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' })
    @MaxLength(100, { message: 'Das Passwort ist zu lang.' })
    // Optionaler Bonus: Erzwingt mindestens eine Zahl und einen Großbuchstaben für echte Sicherheit
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Das Passwort ist zu schwach (muss mindestens 1 Großbuchstaben, 1 Kleinbuchstaben und 1 Zahl enthalten).',
    })
    password: string;
}