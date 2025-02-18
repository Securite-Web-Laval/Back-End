import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DishModule } from './dish/dish.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://ADMIN:1234@secu-web.fxy48.mongodb.net/Secu'),
    AuthModule,
    DishModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
