export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export type CommonError = string | string[] | undefined;

export interface RequestStatus {
	status: Status;
	error: CommonError;
}

export interface HttpError {
	error: string;
	message: string | string[];
	statusCode: number;
}
