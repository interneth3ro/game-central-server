import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthenticatedSocketAdapter } from './sockets/authenticated-socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));
  await app.listen(8080);
}
bootstrap();
