import { EditMediaDto } from '@nx-next-nest/types';
import { useFormik } from 'formik';
import ProtectedPage from '../../utils/ProtectedPage';

const EditMedia = () => {
	const formik = useFormik<EditMediaDto>({
		initialValues: {
			...originalValues,
		},
		onSubmit: (values) => {
			console.log(values);
		},
	});
	return <ProtectedPage originalUrl='/media/edit'></ProtectedPage>;
};

export default EditMedia;
