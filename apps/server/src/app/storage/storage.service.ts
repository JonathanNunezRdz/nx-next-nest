import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageFormat } from '@prisma/client';
import ImageKit from 'imagekit';
import 'multer';

@Injectable()
export class StorageService {
	private readonly imageKit: ImageKit;
	private readonly imaegKitBaseFolder =
		process.env.RAILWAY_ENVIRONMENT === 'production' ? 'v1' : 'dev';

	constructor(config: ConfigService) {
		this.imageKit = new ImageKit({
			publicKey: 'public_A7N6XWKGXgakPLZBrM1FvYdRS7s=',
			privateKey: config.get('IMAGE_KIT_PRIVATE_KEY') as string,
			urlEndpoint: 'https://ik.imagekit.io/wiaimages',
		});
	}

	getFile(imageFileName: string, folder: 'media' | 'waifu' | 'user'): string {
		return this.imageKit.url({
			path: `/${this.imaegKitBaseFolder}/${folder}/${imageFileName}`,
			signed: true,
			expireSeconds: 60,
			transformation: [{ quality: 50 }, { width: 0.5 }],
		});
	}

	async uploadFile(
		file: Express.Multer.File,
		imageFileName: string,
		folder: 'media' | 'waifu' | 'user'
	): Promise<string> {
		const res = await this.imageKit.upload({
			file: file.buffer,
			fileName: imageFileName,
			folder: `${this.imaegKitBaseFolder}/${folder}`,
			useUniqueFileName: false,
		});
		return this.getFile(res.name, folder);
	}

	async deleteFile(imageFileName: string): Promise<void> {
		const [file] = await this.imageKit.listFiles({
			name: imageFileName,
		});
		if (file) {
			await this.imageKit.deleteFile(file.fileId);
			console.log('delete file:', file.fileId, file.filePath);
		}
	}

	/**
	 *
	 * @param {string} id id of user | waifu | media
	 * @param {ImageFormat} format format of image saved
	 * @returns name for file correctly formated
	 */
	formatImagePath(id: string, format: ImageFormat) {
		return `${encodeURIComponent(id)}.${format}`;
	}
}
