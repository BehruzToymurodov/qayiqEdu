export const olympicsService = {
	getOlympics: async () => {
		// Mock implementation
		return new Promise(resolve => {
			setTimeout(() => {
				resolve([
					{
						id: 1,
						contextName: 'Matematika Olimpiadasi',
						subject: 'Matematika',
						status: 'Faol',
						xpPoints: 100,
						solvedCount: 15,
						date: '2024-12-15',
						duration: '120 daqiqa',
					},
					{
						id: 2,
						contextName: 'Fizika Musobaqasi',
						subject: 'Fizika',
						status: 'Tugagan',
						xpPoints: 85,
						solvedCount: 12,
						date: '2024-12-10',
						duration: '90 daqiqa',
					},
				])
			}, 800)
		})
	},

	createOlympic: async olympicData => {
		// Mock implementation
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({
					id: Date.now(),
					...olympicData,
					createdAt: new Date().toISOString(),
				})
			}, 1000)
		})
	},

	updateOlympic: async (id, olympicData) => {
		// Mock implementation
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({
					id,
					...olympicData,
					updatedAt: new Date().toISOString(),
				})
			}, 1000)
		})
	},

	deleteOlympic: async id => {
		// Mock implementation
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({ message: "Olimpiada muvaffaqiyatli o'chirildi" })
			}, 800)
		})
	},
}
