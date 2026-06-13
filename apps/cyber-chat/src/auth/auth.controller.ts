import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Public() // Route ist ungeschützt
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Public() // Route ist ungeschützt
    @UseGuards(AuthGuard('local')) // Aktiviert die LocalStrategy zur Passwort-Prüfung
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('me') // Automatisch geschützt durch den globalen Guard!
    getProfile(@Request() req) {
        return req.user;
    }
}