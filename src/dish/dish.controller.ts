import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('dishes') // Tag pour regrouper les routes de plats
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
          userId: '67b160f7bf662c15ee4dd5c4'
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
          userName: 'john_doe',
          like: ['link_zelda', 'marcus_thuram'],
          comments: [{ userName: 'link_zelda', note: 3, description: 'Super !' }, { userName: 'marcus_thuram', note: 1, description: 'A revoir' }]
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
