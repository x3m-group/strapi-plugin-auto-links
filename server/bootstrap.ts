import { Strapi } from '@strapi/strapi';
import { getPluginService } from './utils/getPluginService';

export default ({ strapi }: { strapi: Strapi }) => {
	// bootstrap phase

	getPluginService(strapi, 'lifecycleService').subscribe();
};
