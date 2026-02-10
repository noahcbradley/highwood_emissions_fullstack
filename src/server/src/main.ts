import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable JSON parsing (default) and CORS if needed
  app.enableCors();

  await app.listen(3001);
  console.log('🚀 Server is running on http://localhost:3001');
}
bootstrap();
