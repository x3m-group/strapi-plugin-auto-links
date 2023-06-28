# strapi-plugin-auto-links

A plugin for [Strapi](https://github.com/strapi/strapi) that auto generate links for resources (`self`, `canonical`, `alternates`, ...)

[![Downloads](https://img.shields.io/npm/dm/strapi-plugin-auto-links?style=for-the-badge)](https://img.shields.io/npm/dm/strapi-plugin-auto-links?style=for-the-badge)
[![Install size](https://img.shields.io/npm/l/strapi-plugin-auto-links?style=for-the-badge)](https://img.shields.io/npm/l/strapi-plugin-auto-links?style=for-the-badge)
[![Package version](https://img.shields.io/github/v/release/ComfortablyCoding/strapi-plugin-auto-links?style=for-the-badge)](https://img.shields.io/github/v/release/ComfortablyCoding/strapi-plugin-auto-links?style=for-the-badge)

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

A sample configuration

```javascript
module.exports = ({ env }) => ({
  // ...
  'auto-links': {
    enabled: true,
    config: {
      contentTypes: {
        article: {
          field: 'slug',
          references: 'title',
        },
      },
    },
  },
  // ...
});
```
