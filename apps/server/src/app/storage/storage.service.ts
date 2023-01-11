import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getStorage, Storage } from 'firebase-admin/storage';
import serviceAccountKey from './serviceAccountKey.json';

@Injectable()
export class StorageService {
	private readonly app: App;
	private readonly storage: Storage;

	constructor(config: ConfigService) {
		serviceAccountKey.private_key = config.get<string>(
			'FIREBASE_PRIVATE_KEY'
		);

		try {
			this.app = initializeApp({
				credential: cert(serviceAccountKey as ServiceAccount),
				storageBucket: 'wia-web-app.appspot.com',
			});
			this.storage = getStorage(this.app);
		} catch (error) {
			console.error('firebase error', error);
			throw new InternalServerErrorException(error);
		}
	}

	async getFile(path: string): Promise<string> {
		return this.storage.bucket().file(path).cloudStorageURI.href;
	}
}
