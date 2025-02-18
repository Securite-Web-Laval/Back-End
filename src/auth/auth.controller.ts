import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from './user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Enregistrer un nouvel utilisateur' })
  @ApiBody({
    description: 'Données de l\'utilisateur à enregistrer',
    type: Object,
    examples: {
      example1: {
        value: {
          username: 'john_doe',
          password: 'securePassword123',
          email: 'john_doe@gmail.com'
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  async register(@Body() body: User) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Connecter un utilisateur' })
  @ApiBody({
    description: 'Identifiants de l\'utilisateur pour la connexion',
    type: Object,
    examples: {
      example1: {
        value: {
          username: 'john_doe',
          password: 'securePassword123',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Connexion réussie, retourne un token.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
