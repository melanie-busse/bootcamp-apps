import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const { username, password } = loginDto;

        // 1. User aus der Datenbank anhand des Namens suchen
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Ungültige Zugangsdaten.');
        }

        // 2. Überprüfen, ob das Passwort mit dem Hash in der DB übereinstimmt
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Ungültige Zugangsdaten.');
        }

        // 3. Payload für das Token definieren (Wichtig: Keine Passwörter hier rein!)
        const payload = { sub: user.id, username: user.username };

        // 4. Token generieren und zurückgeben
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}