import { Schema } from '@strapi/strapi/lib/types/core/schemas';
import { Strapi } from '@strapi/strapi';
import { pluginId } from '../utils/pluginId';

//##############################################################################

export type DeepPartial<T> = T extends Function
	? T
	: T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

//##############################################################################

export interface ContentTypeConfig {
	self: {
		enabled: boolean;
		host: string;
		path: string;
	};
	canonical: {
		enabled: boolean;
		host: string;
		path: string;
	};
	alternates: {
		enabled: boolean;
	};
	model: any;
}

export interface PluginConfig {
	self: {
		enabled: boolean;
		host: string;
		path: string;
	};
	canonical: {
		enabled: boolean;
		host: string;
		path: string;
	};
	alternates: {
		enabled: boolean;
	};
	contentTypes: {
		[modelName: string]: DeepPartial<ContentTypeConfig>;
	};
}

export type PartialPluginConfig = DeepPartial<PluginConfig>;

//##############################################################################

const defaultPluginConfig: PartialPluginConfig = {
	self: {
		enabled: true,
		host: process.env.SELF_HOST || 'http://localhost:1337',
		path: '/api/{model.info.pluralName}/{item.id}',
	},
	canonical: {
		enabled: true,
		host: process.env.CANONICAL_HOST || 'https://example.com',
		path: '/{item.locale}/{model.info.pluralName}/{item.slug}',
	},
	alternates: {
		enabled: true,
	},
};

//##############################################################################

var buildCache: PluginConfig | undefined = undefined;

//##############################################################################

export default ({ strapi }: { strapi: Strapi }) => ({
	pluginConfig(): PartialPluginConfig {
		return strapi.config.get(`plugin.${pluginId}`) as PartialPluginConfig;
	},
	buildConfig(): PluginConfig {
		if (!buildCache) {
			const pluginConfig: PartialPluginConfig = this.pluginConfig();

			const buildConfig: PluginConfig = {
				self: { ...(defaultPluginConfig.self as any) },
				canonical: { ...(defaultPluginConfig.canonical as any) },
				alternates: { ...(defaultPluginConfig.alternates as any) },
				contentTypes: {},
			};

			Object.entries<any>(strapi.contentTypes).forEach(([uid, contentType]) => {
				if (pluginConfig.contentTypes) {
					const contentTypeConfig = pluginConfig.contentTypes[contentType.modelName];
					if (!contentTypeConfig) {
						return;
					}

					if (contentType) {
						buildConfig.contentTypes[uid] = {
							...contentTypeConfig,
							model: contentType,
						};
					}
				}
			});

			buildCache = buildConfig as PluginConfig;
		}

		return buildCache as PluginConfig;
	},
});
