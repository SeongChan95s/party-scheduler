import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useForm } from 'react-hook-form';

interface TrainingData {
	name: string;
	price: string;
}

const getData = async () => {
	try {
		const snapshot = await getDocs(collection(db, 'training'));
		const results = snapshot.docs.map(doc => ({
			id: doc.id,
			...(doc.data() as TrainingData)
		}));
		return results;
	} catch (error) {
		throw new Error();
	}
};

export default function Training() {
	const { data, isSuccess } = useQuery({
		queryFn: getData,
		queryKey: ['data']
	});

	const { handleSubmit, register } = useForm();

	const onSubmit = async (data: {}) => {
		console.log('data', data);
	};

	return (
		<>
			<ul className="flex flex-col gap-12">
				{isSuccess &&
					data.map(el => (
						<li className="p-12 border border-gray-300" key={el.name}>
							<div className="">
								<p>{el.id}</p>
								<p className="text-title-1">{el.name}</p>
								<p>{el.price}</p>
							</div>
						</li>
					))}
			</ul>

			<div className="p-12 border border-gray-300 mt-32">
				<form onSubmit={handleSubmit(onSubmit)}>
					<input {...register('name')} />
					<input type="file" {...register('file')} />
					<button>제출하기</button>
				</form>
			</div>
		</>
	);
}
