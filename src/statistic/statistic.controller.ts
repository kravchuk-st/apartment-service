import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import ParamsWithId from 'src/helper/param-with-id.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @Post()
  create(@Body() createStatisticDto: CreateStatisticDto) {
    return this.statisticService.create(createStatisticDto);
  }

  @Get()
  findAll() {
    return this.statisticService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: ParamsWithId) {
    return this.statisticService.findOne(+id);
  }

  @Patch(':id')
  update(@Param() { id }: ParamsWithId, @Body() updateStatisticDto: UpdateStatisticDto) {
    return this.statisticService.update(+id, updateStatisticDto);
  }

  @Delete(':id')
  remove(@Param() { id }: ParamsWithId) {
    return this.statisticService.remove(+id);
  }
}
