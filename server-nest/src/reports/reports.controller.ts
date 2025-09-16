import { Controller, Get, Query } from '@nestjs/common'
import { ReportsService } from './reports.service'

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.service.list(from, to)
  }
}
