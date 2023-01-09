import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EditUserDto } from '@nx-next-nest/types';
import type { ImageFormat, Prisma, PrismaPromise } from '@prisma/client';
import { hash } from 'argon2';
// import { applicationDefault, initializeApp } from 'firebase-admin/app';
// import { getStorage } from 'firebase-admin/storage';
// import mongoose, { Schema } from 'mongoose';

import { upsertUserImage } from '../../utils';
import { PrismaService } from '../prisma/prisma.service';

import animes from '../../../tmp/dumps/animes.json';
import mangas from '../../../tmp/dumps/mangas.json';
import users from '../../../tmp/dumps/users.json';
import videogames from '../../../tmp/dumps/videogames.json';
import waifus from '../../../tmp/dumps/waifus.json';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private config: ConfigService) {}

	// async mediaFirebase() {
	// 	const ImageFormats: string[] = [
	// 		'apng',
	// 		'avif',
	// 		'gif',
	// 		'jpg',
	// 		'jpeg',
	// 		'jfif',
	// 		'pjpeg',
	// 		'pjp',
	// 		'png',
	// 		'svg',
	// 		'webp',
	// 	];

	// 	try {
	// 		await mongoose.connect(this.config.get('MONGO_URI'));
	// 		mongoose.set('strictQuery', true);
	// 	} catch (error) {
	// 		Logger.error('Error on mongoose connection');
	// 		Logger.error(error.toString());
	// 		return;
	// 	}
	// 	console.log('connected to mongo');

	// 	// create videogame schema
	// 	const childUserSchema = new Schema({
	// 		date: Date,
	// 		uid: String,
	// 	});
	// 	const videogameSchema = new Schema({
	// 		title: String,
	// 		playedBy: [childUserSchema],
	// 		image: {
	// 			has: Boolean,
	// 			path: String,
	// 		},
	// 	});
	// 	const Videogame = mongoose.model('videogame', videogameSchema);

	// 	// find all videogame
	// 	const mongoVideogame = await Videogame.find({}).select({
	// 		title: 1,
	// 		image: 1,
	// 	});
	// 	const getMongoVideogame = () => mongoVideogame;
	// 	type MongoVideogame = ReturnType<typeof getMongoVideogame>[0];
	// 	console.log('found all mongo videogame');

	// 	// init firebase app
	// 	initializeApp({
	// 		credential: applicationDefault(),
	// 		storageBucket: 'wia-web-app.appspot.com',
	// 	});

	// 	// get storage bucket
	// 	const bucket = getStorage().bucket();

	// 	// get all files from videogame images
	// 	const [files] = await bucket.getFiles({
	// 		prefix: 'videogame_images/',
	// 	});
	// 	const getFiles = () => files;
	// 	type FileType = ReturnType<typeof getFiles>[0];
	// 	console.log('found all videogame image files');

	// 	const pairs: {
	// 		videogame: MongoVideogame;
	// 		file: FileType;
	// 	}[] = [];
	// 	mongoVideogame.forEach((videogame) => {
	// 		if (videogame.image.has) {
	// 			const file = files.find(
	// 				(file) => file.name === videogame.image.path
	// 			);
	// 			pairs.push({
	// 				videogame,
	// 				file,
	// 			});
	// 		}
	// 	});

	// 	let skip = false;
	// 	await Promise.all(
	// 		pairs.map(async (pair) => {
	// 			if (skip) return;
	// 			const { videogame, file } = pair;
	// 			const format = videogame.image.path.split('.').pop();
	// 			const newFileName = `videogame_images/${encodeURIComponent(
	// 				videogame.title
	// 			)}.${format}`;

	// 			// if (
	// 			// 	videogame.title !==
	// 			// 	file.name.split('/').pop().split('.').shift()
	// 			// )
	// 			// 	console.log(
	// 			// 		videogame.title,
	// 			// 		'\n',
	// 			// 		file.name,
	// 			// 		'\n',
	// 			// 		newFileName,
	// 			// 		'\n'
	// 			// 	);

	// 			// if (videogame.image.path !== newFileName)
	// 			// 	console.log(
	// 			// 		videogame.title,
	// 			// 		'\n',
	// 			// 		file.name,
	// 			// 		'\n',
	// 			// 		newFileName,
	// 			// 		'\n'
	// 			// 	);

	// 			// try {
	// 			// 	if (skip) return;
	// 			// 	await file.rename(newFileName);
	// 			// 	videogame.image.path = newFileName;
	// 			// 	await videogame.save();
	// 			// } catch (error) {
	// 			// 	skip = true;
	// 			// 	console.error('error at updating', error);
	// 			// 	console.log(pair);
	// 			// }
	// 		})
	// 	);
	// }

	// async waifuFirebase() {
	// 	const ImageFormat: string[] = [
	// 		'apng',
	// 		'avif',
	// 		'gif',
	// 		'jpg',
	// 		'jpeg',
	// 		'jfif',
	// 		'pjpeg',
	// 		'pjp',
	// 		'png',
	// 		'svg',
	// 		'webp',
	// 	];

	// 	// connect to mongo
	// 	try {
	// 		await mongoose.connect(this.config.get('MONGO_URI'));
	// 	} catch (error) {
	// 		Logger.error('Error on mongoose connection');
	// 		Logger.error(error.toString());
	// 		return;
	// 	}
	// 	console.log('connected to mongo');

	// 	// create waifu schema
	// 	const waifuSchema = new Schema({
	// 		name: String,
	// 		uid: String,
	// 		type: Number,
	// 		_anime: { type: Schema.Types.ObjectId, ref: 'Anime' },
	// 		_manga: { type: Schema.Types.ObjectId, ref: 'Manga' },
	// 		_videogame: { type: Schema.Types.ObjectId, ref: 'Videogame' },
	// 		from: String,
	// 		image: {
	// 			has: Boolean,
	// 			path: String,
	// 		},
	// 	});
	// 	const Waifu = mongoose.model('Waifu', waifuSchema);
	// 	mongoose.set('strictQuery', true);

	// 	// find all waifus
	// 	const mongoWaifus = await Waifu.find({}).select({
	// 		name: 1,
	// 		image: 1,
	// 	});
	// 	const getMongoWaifus = () => mongoWaifus;
	// 	type MongoWaifus = ReturnType<typeof getMongoWaifus>[0];
	// 	console.log('found all mongo waifus');

	// 	// init firebase app
	// 	initializeApp({
	// 		credential: applicationDefault(),
	// 		storageBucket: 'wia-web-app.appspot.com',
	// 	});

	// 	// get storage bucket
	// 	const bucket = getStorage().bucket();

	// 	// get all files from waifu images
	// 	const [files] = await bucket.getFiles({
	// 		prefix: 'waifu_images/',
	// 	});
	// 	const getFiles = () => files;
	// 	type FileType = ReturnType<typeof getFiles>[0];
	// 	console.log('found all waifu image files');

	// 	const pairs: {
	// 		waifu: MongoWaifus;
	// 		file: FileType;
	// 	}[] = [];
	// 	mongoWaifus.forEach((waifu) => {
	// 		if (waifu.image.has) {
	// 			const file = files.find(
	// 				(file) => file.name === waifu.image.path
	// 			);
	// 			pairs.push({ waifu, file });
	// 		}
	// 	});

	// 	let skip = false;
	// 	await Promise.all(
	// 		pairs.map(async (pair) => {
	// 			if (skip) return;
	// 			const { waifu, file } = pair;
	// 			const format = waifu.image.path.split('.').pop();
	// 			const newFileName = `waifu_images/${encodeURIComponent(
	// 				waifu.name
	// 			)}.${format}`;
	// 			if (!ImageFormat.includes(format)) {
	// 				skip = true;
	// 				return;
	// 			}

	// 			// try {
	// 			// 	if (
	// 			// 		waifu.name !==
	// 			// 		file.name.split('/').pop().split('.').shift()
	// 			// 	) {
	// 			// console.log(
	// 			// 	waifu.name,
	// 			// 	'\n',
	// 			// 	file.name,
	// 			// 	'\n',
	// 			// 	newFileName,
	// 			// 	'\n'
	// 			// );
	// 			// 	}
	// 			// } catch (error) {
	// 			// 	skip = true;
	// 			// 	console.error(error);
	// 			// 	console.log(pair);
	// 			// }

	// 			// try {
	// 			// 	if (skip) return;
	// 			// 	await file.rename(newFileName);
	// 			// 	waifu.image.path = newFileName;
	// 			// 	await waifu.save();
	// 			// } catch (error) {
	// 			// 	skip = true;
	// 			// 	console.error('error at updating', error);
	// 			// 	console.log(pair);
	// 			// }

	// 			if (waifu.image.path !== newFileName) {
	// 				console.log(
	// 					waifu,
	// 					'\n',
	// 					file.name,
	// 					'\n',
	// 					newFileName,
	// 					'\n'
	// 				);
	// 			}
	// 		})
	// 	);

	// 	// insert to images the image names that don't end with a compatible format
	// 	// const images: Record<string, { metadata: string }> = {};
	// 	// await Promise.all(
	// 	// 	files.map(async (file) => {
	// 	// 		const [meta] = await file.getMetadata();
	// 	// 		if (!ImageFormat.includes(file.name.split('.').pop()))
	// 	// 			images[file.name] = { metadata: meta.contentType };
	// 	// 	})
	// 	// );
	// 	// console.log('found all incompatible image formats');

	// 	// change name of image file in firebase storage along with mongo db waifu.image.path in case it needs to
	// 	// const res: any[] = [];
	// 	// await Promise.all(
	// 	// 	mongoWaifus.map(async (waifu) => {
	// 	// 		if (waifu.image.has && images[waifu.image.path]) {
	// 	// 			const imageType = images[waifu.image.path].metadata
	// 	// 				.split('/')
	// 	// 				.pop();
	// 	// 			const newImageName = `waifu_images/${encodeURIComponent(
	// 	// 				waifu.name
	// 	// 			)}.${imageType}`;
	// 	// 			await bucket.file(waifu.image.path).rename(newImageName);
	// 	// 			waifu.image.path = newImageName;
	// 	// 			await waifu.save();
	// 	// 			res.push({
	// 	// 				oldName: waifu.image.path,
	// 	// 				newName: newImageName,
	// 	// 			});
	// 	// 		}
	// 	// 	})
	// 	// );
	// 	// console.log('changed all image names');
	// 	// res.forEach(console.log);
	// }

	// async checkup() {
	// 	const MediaTypeLabels: string[] = [
	// 		'apng',
	// 		'avif',
	// 		'gif',
	// 		'jpg',
	// 		'jpeg',
	// 		'jfif',
	// 		'pjpeg',
	// 		'pjp',
	// 		'png',
	// 		'svg',
	// 		'webp',
	// 	];
	// 	waifus.forEach((waifu) => {
	// 		if (waifu.image.has) {
	// 			if (
	// 				!MediaTypeLabels.includes(waifu.image.path.split('.').pop())
	// 			) {
	// 				console.log(`${waifu.name} - ${waifu.image.path}`);
	// 			}
	// 		}
	// 	});
	// }

	async migrate() {
		const parseDateFromOID = (oid: string) =>
			new Date(parseInt(oid.slice(0, 8), 16) * 1000).toISOString();

		const hashedPassword = await hash('password');
		const createUsers: Prisma.UserCreateManyInput[] = users.map((elem) => {
			return {
				alias: elem.alias,
				email: elem.email,
				firstName: elem.firstName,
				lastName: elem.lastName,
				hash: hashedPassword,
				uid: elem.uid,
			};
		});

		await this.prisma.user.createMany({
			data: createUsers,
		});

		console.log('created users');

		const createdUsers: Record<string, { id: number }> = {};
		(
			await this.prisma.user.findMany({
				select: {
					uid: true,
					id: true,
				},
			})
		).forEach((user) => {
			createdUsers[user.uid] = { id: user.id };
		});

		console.log('got users ids');

		const originalMedia: Record<
			string,
			{
				knownBy: { uid: string; knownAt: Date }[];
				image: { has: boolean; path: string };
				id: number;
				mongoId: string;
			}
		> = {};
		const mediaByOID: Record<string, number> = {};

		const createMedia: Prisma.MediaCreateManyInput[] = [];

		animes.forEach((anime) => {
			createMedia.push({
				title: anime.title,
				type: 'anime',
				createdAt: parseDateFromOID(anime._id.$oid),
			});

			if (!originalMedia[anime.title])
				originalMedia[anime.title] = {
					knownBy: anime.watchedBy.map((user) => {
						return {
							uid: user.uid,
							knownAt: new Date(
								Number(user.date.$date.$numberLong)
							),
						};
					}),
					image: { ...anime.image },
					id: -1,
					mongoId: anime._id.$oid,
				};
		});

		mangas.forEach((manga) => {
			createMedia.push({
				title: manga.title,
				type: 'manga',
				createdAt: parseDateFromOID(manga._id.$oid),
			});

			if (!originalMedia[manga.title])
				originalMedia[manga.title] = {
					knownBy: manga.readBy.map((user) => {
						return {
							uid: user.uid,
							knownAt: new Date(
								Number(user.date.$date.$numberLong)
							),
						};
					}),
					image: { ...manga.image },
					id: -1,
					mongoId: manga._id.$oid,
				};
		});

		videogames.forEach((videogame) => {
			createMedia.push({
				title: videogame.title,
				type: 'videogame',
				createdAt: parseDateFromOID(videogame._id.$oid),
			});

			if (!originalMedia[videogame.title])
				originalMedia[videogame.title] = {
					knownBy: videogame.playedBy.map((user) => {
						return {
							uid: user.uid,
							knownAt: new Date(
								Number(user.date.$date.$numberLong)
							),
						};
					}),
					image: { ...videogame.image },
					id: -1,
					mongoId: videogame._id.$oid,
				};
		});

		await this.prisma.media.createMany({
			data: createMedia,
		});

		console.log('created media');

		const medias = await this.prisma.media.findMany({
			select: {
				id: true,
				title: true,
			},
		});

		console.log('got media ids');

		medias.forEach((media) => {
			originalMedia[media.title].id = media.id;
		});

		const mediaPromises: PrismaPromise<any>[] = [];
		const imagePromises: PrismaPromise<any>[] = [];
		Object.entries(originalMedia).forEach(([title, media]) => {
			mediaPromises.push(
				this.prisma.media.update({
					where: {
						id: media.id,
					},
					data: {
						knownBy: {
							create: media.knownBy.map((user) => {
								return {
									user: {
										connect: {
											id: createdUsers[user.uid].id,
										},
									},
									knownAt: user.knownAt.toISOString(),
								};
							}),
						},
					},
				})
			);

			mediaByOID[media.mongoId] = media.id;

			if (media.image.has) {
				imagePromises.push(
					this.prisma.image.create({
						data: {
							format: media.image.path
								.split('.')
								.pop() as ImageFormat,
							media: {
								create: {
									mediaId: media.id,
								},
							},
						},
					})
				);
			}
		});

		await this.prisma.$transaction(mediaPromises);

		console.log('updated media');

		await this.prisma.$transaction(imagePromises);

		console.log('created media images');

		const WaifuLevels = {
			1: 'topWaifu',
			2: 'chunin',
			3: 'genin',
			4: 'nationalTreasure',
		};

		const getWaifus = () => waifus;

		const getMediaIdFromMediaOID = (
			waifu: ReturnType<typeof getWaifus>[0]
		) => {
			return mediaByOID[waifu[`_${waifu.from}`].$oid];
		};

		const createManyWaifus: Prisma.WaifuCreateManyInput[] = [];
		const createWaifuImage: Record<
			string,
			{ format: ImageFormat; waifuId: number }
		> = {};
		waifus.forEach((waifu) => {
			const createWaifu: Prisma.WaifuCreateManyInput = {
				name: waifu.name,
				since: parseDateFromOID(waifu._id.$oid),
				level: WaifuLevels[waifu.type],
				mediaId: getMediaIdFromMediaOID(waifu),
				userId: createdUsers[waifu.uid].id,
				createdAt: parseDateFromOID(waifu._id.$oid),
			};
			createManyWaifus.push(createWaifu);

			if (waifu.image.has) {
				createWaifuImage[`${createWaifu.name}-${createWaifu.mediaId}`] =
					{
						format: waifu.image.path
							.split('.')
							.pop() as ImageFormat,
						waifuId: -1,
					};
			}
		});

		await this.prisma.waifu.createMany({
			data: createManyWaifus,
		});

		console.log('created waifus');

		const createdWaifus = await this.prisma.waifu.findMany({
			select: {
				name: true,
				id: true,
				media: {
					select: {
						id: true,
					},
				},
			},
		});

		console.log('got waifus ids');

		createdWaifus.forEach((waifu) => {
			if (createWaifuImage[`${waifu.name}-${waifu.media.id}`])
				createWaifuImage[`${waifu.name}-${waifu.media.id}`].waifuId =
					waifu.id;
		});

		const waifuImagePromises: PrismaPromise<any>[] = [];
		Object.entries(createWaifuImage).forEach(([nameMediaId, props]) => {
			waifuImagePromises.push(
				this.prisma.image.create({
					data: {
						format: props.format,
						waifu: {
							create: {
								waifu: {
									connect: {
										id: props.waifuId,
									},
								},
							},
						},
					},
				})
			);
		});

		await this.prisma.$transaction(waifuImagePromises);

		console.log('created waifu images');
	}

	async editUser(userId: number, dto: EditUserDto) {
		const { alias, firstName, lastName } = dto;
		const upsertUserImageOptions = upsertUserImage(dto);
		const user = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				alias,
				firstName,
				lastName,
				image: upsertUserImageOptions,
			},
			select: {
				id: true,
				alias: true,
				firstName: true,
				lastName: true,
				email: true,
				image: {
					select: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
			},
		});
		return user;
	}

	async getAllUsers() {
		const users = await this.prisma.user.findMany({
			select: {
				id: true,
				alias: true,
				image: {
					select: {
						image: true,
					},
				},
			},
		});
		return users;
	}
}
