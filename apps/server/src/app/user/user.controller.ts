import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { EditUserDto } from '@nx-next-nest/types';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Patch()
	editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
		return this.userService.editUser(userId, dto);
	}

	@Get('me')
	getMe(@GetUser() user: User) {
		return user;
	}
}
