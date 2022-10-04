import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CreateWaifuDto } from './create-waifu.dto';

export class EditWaifuDto extends PartialType(CreateWaifuDto) {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	waifuId: number;
}
