import { ContentTypeConfig, PluginConfig } from './settings-service';

import { Event } from '@strapi/database/lib/lifecycles';
import { Schema } from '@strapi/strapi/lib/types/core/schemas';
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
		if (item.localizations?.length > 0) {
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
	const host = contentType.self?.host || buildConfig.self?.host || '';
	const path = contentType.self?.path || buildConfig.self?.path || '';

	return buildUrl(join(host, path), contentType.model, item);
}

function buildCanonicalURL(
	buildConfig: PluginConfig,
	contentType: Partial<ContentTypeConfig>,
	item: any
) {
	const host = contentType.canonical?.host || buildConfig.canonical?.host || '';
	const path = contentType.canonical?.path || buildConfig.canonical?.path || '';

	return buildUrl(join(host, path), contentType.model, item);
}

function buildUrl(url: string, model: Schema, item: any): string {
	// Helper function to retrieve deeply nested properties.
	const deepValue = (obj: any, path: string) => {
		return path.split('.').reduce((res, key) => (res || {})[key], obj);
	};

	// Regex to find placeholders in curly braces.
	const regex = /\{([^\}]+)\}/g;

	// Replace each placeholder with the respective value from contentType or item.
	const finalUrl = url.replace(regex, (match, placeholder) => {
		// Check if the placeholder has a prefix "model." or "item."
		let replacement;
		if (placeholder.startsWith('model.')) {
			const modelPath = placeholder.slice(6); // Extract path without "model." prefix.
			replacement = deepValue(model, modelPath);
		} else if (placeholder.startsWith('item.')) {
			const itemPath = placeholder.slice(5); // Extract path without "item." prefix.
			replacement = deepValue(item, itemPath);
		} else {
			return match; // If no prefix, leave the placeholder unchanged.
		}

		// If the replacement is undefined, leave the placeholder unchanged.
		return replacement !== undefined ? replacement : match;
	});

	return finalUrl;
}