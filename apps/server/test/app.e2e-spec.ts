import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EditUserDto, SignInDto, SignUpDto } from '@nx-next-nest/types';
import * as pactum from 'pactum';
import { AppModule } from '../src/app/app.module';
import { PrismaService } from '../src/app/prisma/prisma.service';

const userAt = 'userAT';

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
			})
		);

		await app.init();
		await app.listen(3334);

		prisma = app.get(PrismaService);
		await prisma.cleanDb();
		pactum.request.setBaseUrl('http://localhost:3334');
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Auth', () => {
		const signUpDto: SignUpDto = {
			email: 'jonas@jonas.com',
			firstName: 'Jonathan',
			lastName: 'Nunez',
			alias: 'jonas',
			password: '1231',
			uid: 'qwertyuiop',
		};

		describe('Sign Up', () => {
			it('should throw if email empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						...signUpDto,
						email: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if password empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						...signUpDto,
						password: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if firstName empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						...signUpDto,
						firstName: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if lastName empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						...signUpDto,
						lastName: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if alias empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						...signUpDto,
						alias: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if uid empty', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody({
						...signUpDto,
						uid: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if all fields empty', () => {
				return pactum.spec().post('/auth/signup').expectStatus(400);
			});
			it('should sign up', () => {
				return pactum
					.spec()
					.post('/auth/signup')
					.withBody(signUpDto)
					.expectStatus(201);
			});
		});

		const signInDto: SignInDto = {
			email: signUpDto.email,
			password: signUpDto.password,
		};

		describe('Sign In', () => {
			it('should throw if email empty', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody({
						...signInDto,
						email: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if password empty', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody({
						...signInDto,
						password: undefined,
					})
					.expectStatus(400);
			});
			it('should throw if email and password empty', () => {
				return pactum.spec().post('/auth/signin').expectStatus(400);
			});
			it('should sign in', () => {
				return pactum
					.spec()
					.post('/auth/signin')
					.withBody(signInDto)
					.expectStatus(200)
					.stores(userAt, 'accessToken');
			});
		});
	});

	describe('User', () => {
		describe('Get me', () => {
			it('should throw if auth header is not present', () => {
				return pactum.spec().get('/user/me').expectStatus(401);
			});
			it('should get current user', () => {
				return pactum
					.spec()
					.get('/user/me')
					.withHeaders({
						Authorization: `Bearer $S{${userAt}}`,
					})
					.expectStatus(200);
			});
		});

		const editUserDto: EditUserDto = {
			alias: 'Johni',
		};

		describe('Edit user', () => {
			it('should edit user', () => {
				return pactum
					.spec()
					.patch('/user')
					.withHeaders({
						Authorization: `Bearer $S{${userAt}}`,
					})
					.withBody(editUserDto)
					.expectStatus(200)
					.inspect();
			});
		});
	});
});
