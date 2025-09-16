import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('api/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  list() {
    return this.service.list()
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto)
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(Number(id))
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(Number(id), dto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id))
    return { ok: true }
  }
}
