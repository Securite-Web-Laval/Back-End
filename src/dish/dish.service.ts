import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dish, DishDocument } from './dish.schema';

@Injectable()
export class DishService {
  constructor(@InjectModel(Dish.name) private dishModel: Model<DishDocument>) { }

  async create(dishData: Dish): Promise<Dish> {
    const dish: Dish = { ...dishData, like: { total: 0, users: [] }, comments: [] };
    const newDish = new this.dishModel(dish);
    return newDish.save();
  }

  async findAll(): Promise<Dish[]> {
    return this.dishModel.find().populate('user', '-password').populate('like.users', '-password').populate('comments.user', '-password').exec();
  }

  async findDishByUser(id: string): Promise<Dish[]> {
    return this.dishModel.find({ user: id }).populate('user', '-password').populate('like.users', '-password').populate('comments.user', '-password').exec();
  }

  async findOne(id: string): Promise<Dish | null> {
    return this.dishModel.findById(id).populate('user', '-password').populate('like.users', '-password').populate('comments.user', '-password').exec();
  }

  async update(id: string, dish: Dish): Promise<Dish | null> {
    return this.dishModel.findByIdAndUpdate(id, dish, { new: true }).exec();
  }

  async remove(id: string): Promise<Dish | null> {
    return this.dishModel.findByIdAndDelete(id).exec();
  }

  async likeToggle(dishId: string, userId: string): Promise<Dish | null> {
    try {
      const dish = await this.dishModel.findById(dishId);
      if (!dish) return null;

      // Create like structure if it doesn't exist
      if (!dish.like) {
        dish.like = { total: 0, users: [] };
      }

      // Convert userId to string to ensure consistent comparison
      const userIdStr = userId.toString();

      // Check if user already liked the dish - we need to use toString() for ObjectId comparison
      const userIndex = dish.like.users.findIndex(id => id.toString() === userIdStr);

      if (userIndex === -1) {
        // User hasn't liked this dish yet, so add like
        dish.like.users.push(userId);
        dish.like.total = dish.like.total + 1;
      } else {
        // User already liked this dish, so remove like
        dish.like.users.splice(userIndex, 1);
        dish.like.total = Math.max(0, dish.like.total - 1); // Ensure total never goes below 0
      }

      return this.dishModel.findByIdAndUpdate(
        dishId,
        { like: dish.like },
        { new: true }
      ).populate('user', '-password').populate('like.users', '-password').populate('comments.user', '-password').exec();
    } catch (error) {
      console.error('Error in likeToggle:', error);
      throw error;
    }
  }

  async findAllLikedByUser(userId: string): Promise<Dish[]> {
    return this.dishModel
      .find({ 'like.users': userId })
      .populate('user', '-password')
      .populate('like.users', '-password')
      .populate('comments.user', '-password')
      .exec();
  }
}
