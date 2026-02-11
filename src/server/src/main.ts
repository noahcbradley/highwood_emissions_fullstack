import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import 'reflect-metadata'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable JSON parsing (default) and CORS if needed
  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  await app.listen(3001)
  console.log('🚀 Server is running on http://localhost:3001')
}
bootstrap()
