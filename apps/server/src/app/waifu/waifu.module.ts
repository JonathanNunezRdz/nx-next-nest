import { Module } from '@nestjs/common';
import { WaifuController } from './waifu.controller';
import { WaifuService } from './waifu.service';

@Module({
	controllers: [WaifuController],
	providers: [WaifuService],
})
export class WaifuModule {}
