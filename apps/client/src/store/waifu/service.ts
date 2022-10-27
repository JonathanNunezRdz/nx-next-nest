import {
	CreateWaifuDto,
	CreateWaifuResponse,
	EditWaifuDto,
	EditWaifuResponse,
	GetAllWaifusDto,
	GetAllWaifusResponse,
} from '@nx-next-nest/types';
import api from '../api';

const editWaifu = (dto: EditWaifuDto) =>
	api.patch<EditWaifuResponse>('/waifu', dto);

const getAllWaifus = (dto: GetAllWaifusDto) =>
	api.get<GetAllWaifusResponse>('/waifu', { params: { ...dto } });

const addWaifu = (dto: CreateWaifuDto) =>
	api.post<CreateWaifuResponse>('/waifu', dto);

const waifuService = {
	editWaifu,
	getAllWaifus,
	addWaifu,
};

export default waifuService;
