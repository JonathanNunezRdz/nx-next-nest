import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import 'multer';

@Injectable()
export class StorageService {
	private readonly imageKit: ImageKit;

	constructor(config: ConfigService) {
		this.imageKit = new ImageKit({
			publicKey: 'public_A7N6XWKGXgakPLZBrM1FvYdRS7s=',
			privateKey: config.get('IMAGE_KIT_PRIVATE_KEY'),
			urlEndpoint: 'https://ik.imagekit.io/wiaimages',
		});
	}

	getFile(path: string): string {
		return this.imageKit.url({
			path: `/v1/${path}`,
			signed: true,
			expireSeconds: 60,
		});
	}

	async uploadFile(
		file: Express.Multer.File,
		filename: string,
		format: string
	): Promise<string> {
		const res = await this.imageKit.upload({
			file: file.buffer,
			fileName: `${filename}.${format}`,
			folder: 'v1',
			useUniqueFileName: false,
		});
		return this.getFile(res.name);
	}

	async deleteFile(filename: string): Promise<void> {
		const res = await this.imageKit.listFiles({
			searchQuery: `name=${filename}`,
		});
		console.log(res);
	}
}
