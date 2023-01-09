import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { EditUserDto, GetAllUsersResponse } from '@nx-next-nest/types';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@UseGuards(JwtGuard)
	@Patch()
	editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
		return this.userService.editUser(userId, dto);
	}

	@UseGuards(JwtGuard)
	@Get('me')
	getMe(@GetUser() user: User) {
		return user;
	}

	@Get('all')
	getAllUsers(): Promise<GetAllUsersResponse> {
		return this.userService.getAllUsers();
	}

	@Patch('migrate')
	migrate() {
		// return this.userService.migrate();
		return false;
	}

	// @Get('checkup')
	// checkup() {
	// 	return this.userService.checkup();
	// }

	// // @Get('waifu_firebase')
	// waifuFirebase() {
	// 	return this.userService.waifuFirebase();
	// }

	// // @Get('media_firebase')
	// mediaFirebase() {
	// 	return this.userService.mediaFirebase();
	// }
}
