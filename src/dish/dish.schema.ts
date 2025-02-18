import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
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
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: any;

  @Prop({ required: true })
  note: number;

  @Prop({ required: true })
  description: string;
}

@Schema()
export class Like {
  @Prop({ type: [Types.ObjectId], ref: User.name, required: true })
  users: any[];

  @Prop({ required: true })
  total: number;
}

@Schema()
export class Dish {
  @Prop({ required: true })
  nom: string;

  @Prop({ type: [Ingredient], required: true })
  ingredients: Ingredient[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: any;

  @Prop({ type: Like })
  like: Like;

  @Prop({ type:[Comment] })
  comments: Comment[];
}

export const DishSchema = SchemaFactory.createForClass(Dish);