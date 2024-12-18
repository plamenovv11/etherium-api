import { User } from './lime/entities/user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './lime/services/user.service';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './lime/entities/transaction.entity';
import { AuthController } from './auth/auth.controller';
import { EthereumService } from './lime/services/ethereum.service';
import { UserSeederService } from './lime/services/user.seeder.service';
import { TransactionService } from './lime/services/transaction.service';
import { TransactionController } from './lime/controllers/transaction.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_CONNECTION_URL,
      entities: [Transaction, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [TransactionController, AuthController],
  providers: [UserSeederService, EthereumService, UserSeederService, TransactionService, AuthService, UserService],
})
export class AppModule { }
