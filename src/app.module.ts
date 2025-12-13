import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReferralsModule } from './referrals/referrals.module';
import { TasksModule } from './tasks/tasks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConditionalModule } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './commons/guards/jwt.strategy';

@Module({
  imports: [
  ConfigModule.forRoot({ 
    isGlobal:true,

  }),

    MongooseModule.forRoot(process.env.MONGO_URI || ""),
    UsersModule, ReferralsModule, TasksModule, TransactionsModule, ExchangeRateModule],
  controllers: [AppController],
  providers: [AppService,
    JwtStrategy
  ]
})
export class AppModule {}
