import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common'
import { MouvementsService } from './mouvements.service'
import { AnyFilesInterceptor } from '@nestjs/platform-express'

@Controller('api/mouvements')
export class MouvementsController {
  constructor(private readonly service: MouvementsService) {}

  @Get()
  list() {
    return this.service.list()
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Req() req: any, @Body() body: any) {
    if (req.is('multipart/form-data')) {
      return this.service.createFromMultipart(req.body)
    }
    return this.service.createFromBody(body)
  }
}
