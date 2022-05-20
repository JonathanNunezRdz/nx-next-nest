import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('/')
	hello() {
		return this.authService.helloWord();
	}

	@Post('signup')
	signup(@Body() dto: SignUpDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto: SignInDto) {
		return this.authService.signin(dto);
	}
}
