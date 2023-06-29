import { ContentTypeConfig, PluginConfig } from './settings-service';

import { Event } from '@strapi/database/lib/lifecycles';
import { Strapi } from '@strapi/strapi';
import { getPluginService } from '../utils/getPluginService';
import { join } from 'path';

export default ({ strapi }: { strapi: Strapi }) => {
	const settingsService = getPluginService(strapi, 'settingsService');

	return {
		updateQueryFindOne(queryRequest: Event) {
			const buildConfig = settingsService.buildConfig() as PluginConfig;
			const contentType = buildConfig.contentTypes[queryRequest.model.uid] as ContentTypeConfig;
			if (!contentType) {
				return;
			}
		},
		updateQueryFindMany(queryRequest: Event) {
			const buildConfig = settingsService.buildConfig() as PluginConfig;
			const contentType = buildConfig.contentTypes[queryRequest.model.uid] as ContentTypeConfig;

			if (!contentType) {
				return;
			}
		},
		addLinksFindOne(event: Event & { result: any }) {
			const buildConfig = settingsService.buildConfig() as PluginConfig;
			const contentType = buildConfig.contentTypes[event.model.uid] as ContentTypeConfig;
			if (!contentType) {
				return;
			}

			addLinks(buildConfig, contentType, event.result);
		},
		addLinksFindMany(event: Event & { result: any[] }) {
			const buildConfig = settingsService.buildConfig() as PluginConfig;
			const contentType = buildConfig.contentTypes[event.model.uid] as ContentTypeConfig;
			if (!contentType) {
				return;
			}

			event.result.map((item) => {
				addLinks(buildConfig, contentType, item);
			});
		},
	};
};

function addLinks(buildConfig: PluginConfig, contentType: Partial<ContentTypeConfig>, item: any) {
	const links: any = {};

	if (contentType.self?.enabled || buildConfig.self.enabled) {
		links['self'] = buildSelfURL(buildConfig, contentType, item);
	}

	if (contentType.canonical?.enabled || buildConfig.canonical.enabled) {
		links['canonical'] = buildCanonicalURL(buildConfig, contentType, item);
	}

	if (contentType.alternates?.enabled || buildConfig.alternates.enabled) {
		const alternates: {}[] = [];

		item.localizations?.forEach((localization) => {
			const a = {
				locale: localization.locale,
			};

			if (contentType.self?.enabled || buildConfig.self.enabled) {
				a['self'] = buildSelfURL(buildConfig, contentType, localization);
			}

			if (contentType.canonical?.enabled || buildConfig.canonical.enabled) {
				a['canonical'] = buildCanonicalURL(buildConfig, contentType, localization);
			}

			alternates.push(a);
		});

		if (Object.keys(alternates).length > 0) {
			links['alternates'] = alternates;
		}
	}

	if (Object.keys(links).length > 0) {
		item.links = links;
	}
}

function buildSelfURL(
	buildConfig: PluginConfig,
	contentType: Partial<ContentTypeConfig>,
	item: any
) {
	console.log(contentType.self?.host, buildConfig.self?.host);

	const host = contentType.self?.host || buildConfig.self?.host || '';
	const path = contentType.self?.path || buildConfig.self?.path || '';

	return buildUrl(contentType, item, join(host, path));
}

function buildCanonicalURL(
	buildConfig: PluginConfig,
	contentType: Partial<ContentTypeConfig>,
	item: any
) {
	const host = contentType.canonical?.host || buildConfig.canonical?.host || '';
	const path = contentType.canonical?.path || buildConfig.canonical?.path || '';

	return buildUrl(contentType, item, join(host, path));
}

function buildUrl(contentType: Partial<ContentTypeConfig>, item: any, url: string): string {
	console.log(contentType.model);

	return url.replace(/{([^}]+)}/g, function (match, path) {
		let parts = path.split('.');
		let current = parts[0] === 'item' ? item : contentType.model;

		for (let i = 1; i < parts.length; i++) {
			current = current[parts[i]];
			if (current === undefined) return match; // leave unreplaced if path is invalid
		}

		return current;
	});
}
