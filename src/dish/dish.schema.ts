import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../auth/user.schema';

export type DishDocument = Dish & Document;

@Schema()
export class Ingredient {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  quantite: number;

  @Prop({ required: true })
  unite: string;
}

@Schema()
export class Comment {
  @Prop({ type: String, ref: User.name, required: true })
  userName: string;

  @Prop({ required: true })
  note: number;

  @Prop({ required: true })
  description: string;
}

@Schema()
export class Dish {
  @Prop({ required: true })
  nom: string;

  @Prop({ type: [Ingredient], required: true })
  ingredients: Ingredient[];

  @Prop({ type: String, ref: User.name, required: true })
  userName: string;

  @Prop({ type:[String], ref: User.name })
  like: string[];

  @Prop({ type:[Comment] })
  comments: Comment[];
}

export const DishSchema = SchemaFactory.createForClass(Dish);