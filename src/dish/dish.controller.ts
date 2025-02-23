import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('dishes')
@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

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
          user: '67b40b9aaf694dd1dcc82bbe'
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
          comments: [{ user: '67b40e0d714f447336bbad59', note: 3, description: 'Super !' }, { user: '67b40e2f59178ecf3b818356', note: 1, description: 'A revoir' }]
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
}
