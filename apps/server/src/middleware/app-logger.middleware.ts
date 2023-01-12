import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, originalUrl, hostname } = request;
		const userAgent = request.get('user-agent') || '';

		response.on('close', () => {
			const { statusCode } = response;
			const contentLength = response.get('content-length');
			const message = `${method} | ${originalUrl} | ${statusCode} | ${contentLength} - ${userAgent} | ${ip} - ${hostname}`;
			if (statusCode < 400) this.logger.log(message);
			else this.logger.error(message);
		});

		next();
	}
}
