import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { PrismaModule } from './prisma/prisma.module';
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
	],
})
export class AppModule {}
