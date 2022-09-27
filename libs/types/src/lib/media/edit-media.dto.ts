import { PartialType } from '@nestjs/mapped-types';
import { IsInt } from 'class-validator';

import { CreateMediaDto } from './create-media.dto';

export class EditMediaDto extends PartialType(CreateMediaDto) {
	@IsInt()
	mediaId: number;
}
