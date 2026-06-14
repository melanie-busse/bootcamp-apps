import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // Optional: Hier kannst du das Fehlerverhalten anpassen, falls das Token ungültig ist
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('Zugriff verweigert. Ungültiges oder fehlendes Token.');
        }
        return user;
    }
}