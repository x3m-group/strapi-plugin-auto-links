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
npm install strapi-plugin-auto-links

# or

yarn add strapi-plugin-auto-links
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
        host: "https://{locale}.example.com",
        path: "/resources/{model.info.pluralName}/{item.slug}",
      },
      contentTypes: {
        article: {},
        tags: {
          canonical: {
            host: "https://tags.example.com",
            path: "/locale/{item.slug}",
          },
        },
      },
    },
  },
  // ...
});
```

## Result

`http://localhost:1337/api/articles?populate=*`

```json
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
            {
              "id": 2,
              "attributes": {
                "title": "Mijn Eerste Artikel Nederlands",
                "slug": "mijn-eerste-artikel-nederlands",
                "locale": "nl"
              }
            }
          ]
        },
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
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```
