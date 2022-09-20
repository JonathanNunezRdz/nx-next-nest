export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface HttpError {
	error: string;
	message: string | string[];
	statusCode: number;
}
