import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dish, DishDocument } from './dish.schema';

@Injectable()
export class DishService {
  constructor(@InjectModel(Dish.name) private dishModel: Model<DishDocument>) {}

  async create(dishData: Dish): Promise<Dish> {
    const dish: Dish = {...dishData, like: [], comments: []};
    const newDish = new this.dishModel(dish);
    return newDish.save();
  }

  async findAll(): Promise<Dish[]> {
    return this.dishModel.find().exec();
  }

  async findOne(id: string): Promise<Dish | null> {
    return this.dishModel.findById(id).exec();
  }

  async update(id: string, dish: Dish): Promise<Dish | null> {
    return this.dishModel.findByIdAndUpdate(id, dish, { new: true }).exec();
  }

  async remove(id: string): Promise<Dish | null> {
    return this.dishModel.findByIdAndDelete(id).exec();
  }
}
