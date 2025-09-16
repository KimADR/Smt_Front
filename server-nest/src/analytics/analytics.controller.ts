import { Controller, Get, Query } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('summary')
  summary(@Query('period') period?: string) {
    return this.service.summary(period)
  }

  @Get('monthly')
  monthly(@Query('months') months?: string) {
    return this.service.monthly(Number(months || 6))
  }

  @Get('sector')
  sector() {
    return this.service.sector()
  }

  @Get('tax-compliance')
  taxCompliance() {
    return this.service.taxCompliance()
  }

  @Get('cashflow')
  cashflow(@Query('weeks') weeks?: string) {
    return this.service.cashflow(Number(weeks || 4))
  }

  @Get('top-enterprises')
  topEnterprises() {
    return this.service.topEnterprises()
  }
}
