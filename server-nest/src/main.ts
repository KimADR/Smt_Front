import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  const origin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  app.use(cors({ origin, credentials: true }))

  const port = Number(process.env.PORT || 4000)
  await app.listen(port)
}
bootstrap()
