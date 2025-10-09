import { API_ROUTES, BASE_URL } from '@/constants/api'
import axios from 'axios'

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

apiClient.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response.status === 401 && !location.pathname.includes('/login')) {
			apiClient.post(API_ROUTES.auth.logout).then(() => {
				localStorage.removeItem('user')
				location.href = '/login'
			})
		}
		throw error
	},
)

export default apiClient
