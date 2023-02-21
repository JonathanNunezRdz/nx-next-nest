import { HttpError } from '@nx-next-nest/types';
import { Waifu } from '@prisma/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import waifuService from '../service';

export const deleteWaifuAction = createAsyncThunk<
	void,
	{ waifuId: Waifu['id'] },
	{ rejectValue: HttpError }
>('waifu/delete', async ({ waifuId }, { rejectWithValue }) => {
	try {
		await waifuService.deleteWaifu();
	} catch (error) {}
});
