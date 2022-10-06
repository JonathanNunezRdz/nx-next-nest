import { GetAllWaifusDto, GetAllWaifusResponse } from '@nx-next-nest/types';
import api from '../api';

const getAllWaifus = (dto: GetAllWaifusDto) =>
	api.get<GetAllWaifusResponse>('/waifu', { params: { ...dto } });

const waifuService = {
	getAllWaifus,
};

export default waifuService;
