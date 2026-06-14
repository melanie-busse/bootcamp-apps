import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto'; // <-- Pfad eventuell prüfen (ggf. ../auth/dto/register.dto oder ähnlich)
import { UsersService } from '../users/users.service'; // <-- NEU: Für das Registrieren benötigt
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // <-- NEU: Für die Swagger-Doku

@ApiTags('auth') // <-- NEU: Sortiert alle Routen hier perfekt unter "auth" ein!
@Controller('auth')
export class AuthController {
  // Wir injizieren sowohl den AuthService für den Login als auch den UsersService für die Registrierung
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // <-- NEU
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login mit Benutzername/E-Mail' })
  @ApiResponse({
    status: 200,
    description: 'Erfolgreich eingeloggt, gibt das JWT-Token zurück.',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register') // <-- NEU: Hier ist die Route jetzt sicher vor dem JwtAuthGuard!
  @ApiOperation({ summary: 'Einen neuen Piraten-Account registrieren' })
  @ApiResponse({ status: 201, description: 'Benutzer erfolgreich angelegt.' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }
}
