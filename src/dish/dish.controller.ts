import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Dish } from './dish.schema';
import { DishService } from './dish.service';

@ApiTags('dishes')
@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un plat' })
  @ApiBody({
    description: 'Données du plat à créer',
    type: Dish,
    examples: {
      example1: {
        value: {
          nom: 'Pâtes à la sauce tomate',
          ingredients: [
            { nom: 'Pâtes', quantite: 200, unite: 'grammes' },
            { nom: 'Sauce tomate', quantite: 150, unite: 'ml' },
          ],
          user: '67b40b9aaf694dd1dcc82bbe',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Plat créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  async create(@Body() dish: Dish) {
    return this.dishService.create(dish);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les plats' })
  @ApiResponse({ status: 200, description: 'Liste des plats.', type: [Dish] })
  async findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un plat par ID' })
  @ApiResponse({ status: 200, description: 'Le plat correspondant à l\'ID.', type: Dish })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async findOne(@Param('id') id: string) {
    return this.dishService.findOne(id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Recuperer les plats par ID User' })
  @ApiResponse({ status: 200, description: 'Les plats correspondant à l\'ID User.', type: [Dish] })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async findDishByUser(@Param('id') id: string) {
    return this.dishService.findDishByUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un plat' })
  @ApiBody({
    description: 'Données du plat à mettre à jour',
    type: Dish,
    examples: {
      example1: {
        value: {
          nom: 'Pâtes à la sauce tomate',
          ingredients: [
            { nom: 'Pâtes', quantite: 200, unite: 'grammes' },
            { nom: 'Sauce tomate', quantite: 150, unite: 'ml' },
          ],
          user: '67b40b9aaf694dd1dcc82bbe',
          like: { total: 2, users: ['67b40e0d714f447336bbad59', '67b40e2f59178ecf3b818356'] },
          comments: [{ user: '67b40e0d714f447336bbad59', note: 3, description: 'Super !' }, { user: '67b40e2f59178ecf3b818356', note: 1, description: 'A revoir' }],
          cookingTime: 30
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Plat mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async update(@Param('id') id: string, @Body() dish: Dish) {
    return this.dishService.update(id, dish);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un plat' })
  @ApiResponse({ status: 200, description: 'Plat supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  async remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('like/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike a dish' })
  @ApiResponse({ status: 200, description: 'Like status toggled successfully.' })
  @ApiResponse({ status: 404, description: 'Dish not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async likeToggle(@Param('id') id: string, @Request() req) {
    try {
      const result = await this.dishService.likeToggle(id, req.user._id);
      if (!result) {
        return { statusCode: 404, message: 'Dish not found' };
      }
      return result;
    } catch (error) {
      console.error('Error toggling like:', error);
      return { statusCode: 500, message: error.message || 'Internal server error' };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('liked')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all dishes liked by current user' })
  @ApiResponse({ status: 200, description: 'List of liked dishes.', type: [Dish] })
  async getLikedDishes(@Request() req) {
    return this.dishService.findAllLikedByUser(req.user._id);
  }
}
