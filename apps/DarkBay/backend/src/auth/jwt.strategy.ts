import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Sucht nach 'Authorization: Bearer <TOKEN>'
            ignoreExpiration: false,
            secretOrKey: 'SUPER_GEHEIMES_SECRET_NUR_FUER_DEN_DEV_MODUS', // Muss exakt dasselbe Secret wie im AuthModule sein!
        });
    }

    async validate(payload: any) {
        // Was hier zurückgegeben wird, steht danach als 'req.user' im Controller zur Verfügung
        return { id: payload.sub, username: payload.username };
    }
}