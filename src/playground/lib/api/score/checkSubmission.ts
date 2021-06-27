import type { ScoreDataType } from '@/types/index';
import apiCall from '../apiCall';

export default async function checkSubmission(currentQid: number, scoreId: number) {
	return apiCall({ method: 'GET', url: 'scores', particularId: scoreId }).then(
		(data: ScoreDataType) => {
			if (data?.quizzes.some((quiz) => quiz.id === currentQid)) {
				return true;
			}
			return false;
		}
	);
}
