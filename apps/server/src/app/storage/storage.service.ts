import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import 'multer';

// TODO: move/copy images from firebase to imageKit

@Injectable()
export class StorageService {
	private readonly imageKit: ImageKit;

	constructor(config: ConfigService) {
		this.imageKit = new ImageKit({
			publicKey: 'public_A7N6XWKGXgakPLZBrM1FvYdRS7s=',
			privateKey: config.get('IMAGE_KIT_PRIVATE_KEY') as string,
			urlEndpoint: 'https://ik.imagekit.io/wiaimages',
		});
	}

	getFile(imageFileName: string): string {
		// TODO: fix different folders
		return this.imageKit.url({
			path: `/v1/${imageFileName}`,
			signed: true,
			expireSeconds: 60,
			transformation: [{ quality: 50 }, { width: 0.5 }],
		});
	}

	async uploadFile(
		file: Express.Multer.File,
		imageFileName: string
	): Promise<string> {
		const res = await this.imageKit.upload({
			file: file.buffer,
			fileName: imageFileName,
			folder: 'v1',
			useUniqueFileName: false,
		});
		return this.getFile(res.name);
	}

	async deleteFile(imageFileName: string): Promise<void> {
		const [file] = await this.imageKit.listFiles({
			searchQuery: `name=${imageFileName}`,
		});
		if (file) {
			await this.imageKit.deleteFile(file.fileId);
			console.log('delete file:', file.fileId, file.filePath);
		}
	}
}
