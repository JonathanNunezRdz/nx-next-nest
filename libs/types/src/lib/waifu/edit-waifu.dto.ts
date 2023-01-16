import { PartialType } from '@nestjs/mapped-types';
import { User, Waifu } from '@prisma/client';
import { IsUUID } from 'class-validator';
import { CreateWaifuDto } from './create-waifu.dto';

export class EditWaifuDto extends PartialType(CreateWaifuDto) {
	@IsUUID(4)
	waifuId: Waifu['id'];
}

export interface EditWaifuService {
	userId: User['id'];
	waifuDto: EditWaifuDto;
	imageFile?: Express.Multer.File;
}
