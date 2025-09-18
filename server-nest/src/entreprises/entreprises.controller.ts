import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { EntreprisesService } from './entreprises.service'
import { CreateEntrepriseDto, UpdateEntrepriseDto } from './dto/create-entreprise.dto'

@Controller('api/entreprises')
export class EntreprisesController {
  constructor(private readonly service: EntreprisesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Post()
  create(@Body() dto: CreateEntrepriseDto) {
    return this.service.create(dto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id))
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEntrepriseDto) {
    return this.service.update(Number(id), dto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id))
    return { ok: true }
  }
}
