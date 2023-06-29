import { pluginId } from './pluginId';

export const getPluginService = (strapi, name, plugin = pluginId) =>
	strapi.plugin(plugin).service(name);
