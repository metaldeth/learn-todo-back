import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { TaskModule } from './domains/task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TaskModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
