import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Statistic, StatisticSchema } from './schema/statistic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Statistic.name, schema: StatisticSchema },
    ])
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule { }
