export const profileService = {
	updateProfile: async profileData => {
		// Mock implementation
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({
					...profileData,
					updatedAt: new Date().toISOString(),
				})
			}, 1000)
		})
	},

	uploadAvatar: async file => {
		// Mock implementation
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({
					url: URL.createObjectURL(file),
				})
			}, 1000)
		})
	},
}
