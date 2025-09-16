import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { EntreprisesModule } from './entreprises/entreprises.module'
import { UsersModule } from './users/users.module'
import { MouvementsModule } from './mouvements/mouvements.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { ReportsModule } from './reports/reports.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    EntreprisesModule,
    UsersModule,
    MouvementsModule,
    AnalyticsModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
