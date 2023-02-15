import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerMiddleware } from '../middleware/app-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { WaifuModule } from './waifu/waifu.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		UserModule,
		MediaModule,
		WaifuModule,
		PrismaModule,
		StorageModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
