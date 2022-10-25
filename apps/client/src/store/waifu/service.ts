import {
	CreateWaifuDto,
	CreateWaifuResponse,
	GetAllWaifusDto,
	GetAllWaifusResponse,
} from '@nx-next-nest/types';
import api from '../api';

const getAllWaifus = (dto: GetAllWaifusDto) =>
	api.get<GetAllWaifusResponse>('/waifu', { params: { ...dto } });

const addWaifu = (dto: CreateWaifuDto) =>
	api.post<CreateWaifuResponse>('/waifu', dto);

const waifuService = {
	getAllWaifus,
	addWaifu,
};

export default waifuService;
