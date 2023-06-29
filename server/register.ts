import { Strapi } from '@strapi/strapi';
import { getPluginService } from './utils/getPluginService';

export default ({ strapi }: { strapi: Strapi }) => {
	// registeration phase

	const settingsService = getPluginService(strapi, 'settingsService');

	// ensure we have at least one model before attempting registration
	if (!Object.keys(settingsService.buildConfig()).length) {
		return;
	}
};
