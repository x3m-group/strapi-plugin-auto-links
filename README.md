# strapi-plugin-auto-links

A plugin for [Strapi](https://github.com/strapi/strapi) that auto generate links for resources (`self`, `canonical`, `alternates`, ...)

[![Downloads](https://img.shields.io/npm/dm/@x3m-group/strapi-plugin-auto-links?style=for-the-badge)](https://img.shields.io/npm/dm/@x3m-group/strapi-plugin-auto-links?style=for-the-badge)
[![Install size](https://img.shields.io/npm/l/@x3m-group/strapi-plugin-auto-links?style=for-the-badge)](https://img.shields.io/npm/l/@x3m-group/strapi-plugin-auto-links?style=for-the-badge)
[![Package version](https://img.shields.io/github/v/release/x3m-group/strapi-plugin-auto-links?style=for-the-badge)](https://img.shields.io/github/v/release/x3m-group/strapi-plugin-auto-links?style=for-the-badge)

## Requirements

The installation requirements are the same as Strapi itself and can be found in the documentation on the [Quick Start](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html) page in the Prerequisites info card.

### Supported Strapi versions

- v4.x.x

## Installation

```sh
npm install @x3m-group/strapi-plugin-auto-links

# or

yarn add @x3m-group/strapi-plugin-auto-links
```

## Configuration

The plugin configuration is stored in a config file located at `./config/plugins.js` or `./config/plugins.ts`.

A minimal configuration

```javascript
module.exports = ({ env }) => ({
  // ...
  "auto-links": {
    enabled: true,
    config: {
      contentTypes: {
        article: {},
      },
    },
  },
  // ...
});
```

Custom Canonical configuration

```javascript
module.exports = ({ env }) => ({
  // ...
  "auto-links": {
    enabled: true,
    config: {
      canonical: {
        host: "https://{item.locale}.example.com",
        path: "/resources/{model.info.pluralName}/{item.slug}",
      },
      contentTypes: {
        author: {},
        article: {},
        tag: {
          canonical: {
            host: "https://tags.example.com",
            path: "/{item.slug}?q=all",
          },
        },
      },
    },
  },
  // ...
});
```

## Example result

`http://localhost:1337/api/articles?populate=*`

```javascript
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "My First Article English",
        "slug": "my-first-article-english",
        "locale": "en",
        "localizations": {
          "data": [
            ...
          ]
        },

        // newly auto generated links
        "links": {
          "self": "http:/localhost:1337/api/articles/1",
          "canonical": "https:/example.com/articles/my-first-article-english",
          "alternates": [
            {
              "locale": "nl",
              "self": "http:/localhost:1337/api/articles/2",
              "canonical": "https:/example.com/articles/mijn-eerste-artikel-nederlands"
            }
          ]
        }
        // ...

      }
    }
  ],
  "meta": {
    ...
  }
}
```
## Configuration Object

| Property | Description | Type | Default | Required |
|----------|-------------|------|---------|----------|
| self | global self configuration | Object | {} | No |
| self.enabled | enable self url rendering | Boolean | true | No |
| self.host | default global self host pattern | String | env SELF_HOST or `http://localhost:1337` | No |
| self.path | default global self path pattern | String | `/api/{model.info.pluralName}/{item.id}` | No |
| canonical | global canonical configuration | Object | {} | No |
| canonical.enabled | enable canonical url rendering | Boolean | true | No |
| canonical.host | default global canonical host pattern | String | env CANONICAL_HOST or `https://example.com` | No |
| canonical.path | default global canonical path pattern | String | `/{item.locale}/{model.info.pluralName}/{item.slug}` | No |
| alternates | global alternates configuration | Object | {} | No |
| alternates.enabled | enable alternates url rendering (localized links) | Boolean | true | No |
| contentTypes | The Content Types to add auto links | Object | {} | No |
| contentTypes[modelName] | The model name of the content type (it is the singularName in the model schema) | Object | {} | Yes |
| contentTypes[modelName].self | override global self configuration | Object | {} | No |
| contentTypes[modelName].self.enabled | enable self url rendering | Boolean | true | No |
| contentTypes[modelName].self.host | self host pattern | String | global value | No |
|contentTypes[modelName].self.path | self path pattern | String | global value | No |
| contentTypes[modelName].canonical | override global canonical configuration | Object | {} | No |
| contentTypes[modelName].canonical.enabled | enable canonical url rendering | Boolean | true | No |
| contentTypes[modelName].canonical.host | canonical host pattern | String | global value | No |
| contentTypes[modelName].canonical.path | canonical path pattern | String | global value | No |
| contentTypes[modelName].alternates | override global alternates configuration | Object | {} | No |
| contentTypes[modelName].alternates.enabled | enable alternates url rendering (localized links) | Boolean | true | No |

## Context Vars

| Property | Description | Type |
|----------|-------------|------|
| item | the current resource item | Object |
| item.* | all available properties of the resource item (must be selected/populated) | Any |
| model | the current resource schema information | Object |
| model.kind | defines if the content-type is collectionType or singleType | String |
| model.collectionName | database table name in which the data should be stored | String |
| model.info | strapi model information | Object |
| model.info.displayName | default name to use in the admin panel | String |
| model.info.singularName | singular form of the content-type name | String |
| model.info.pluralName | plural form of the content-type name | String |