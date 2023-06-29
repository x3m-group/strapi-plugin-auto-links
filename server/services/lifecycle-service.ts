import { Event } from '@strapi/database/lib/lifecycles';
import { PluginConfig } from './settings-service';
import { Strapi } from '@strapi/strapi';
import { SubscriberMap } from '@strapi/database/lib/lifecycles/subscribers';
import { getPluginService } from '../utils/getPluginService';

export default ({ strapi }: { strapi: Strapi }) => {
	const settingsService = getPluginService(strapi, 'settingsService');
	const linksService = getPluginService(strapi, 'linksService');

	return {
		subscribe() {
			const buildConfig: PluginConfig = settingsService.buildConfig();

			const subscribe: Partial<SubscriberMap> & { models: string[] } = {
				models: [],
				beforeFindMany: this.beforeFindManyHandler,
				afterFindMany: this.afterFindManyHandler,
				beforeFindOne: this.beforeFindOneHandler,
				afterFindOne: this.afterFindOneHandler,
			};

			if (buildConfig.contentTypes) {
				Object.keys(buildConfig.contentTypes).forEach((uid) => {
					subscribe.models.push(uid);
				});
			}

			strapi.db.lifecycles.subscribe(subscribe as SubscriberMap);
		},
		beforeFindManyHandler(event: Event) {
			linksService.updateQueryFindMany(event);
		},
		afterFindManyHandler(event: Event) {
			linksService.addLinksFindMany(event);
		},
		beforeFindOneHandler(event: Event) {
			linksService.updateQueryFindOne(event);
		},
		afterFindOneHandler(event: Event) {
			linksService.addLinksFindOne(event);
		},
	};
};
