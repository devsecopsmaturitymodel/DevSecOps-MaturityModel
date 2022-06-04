[![Build Status][tests-badge]][tests-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Code Climate][codeclimate-badge]][codeclimate-url]
[![License][license-badge]][license-url]

# webpack-subresource-integrity

Webpack plugin for enabling Subresource Integrity.

[Subresource Integrity](http://www.w3.org/TR/SRI/) (SRI) is a security
feature that enables browsers to verify that files they fetch (for
example, from a CDN) are delivered without unexpected
manipulation.

**Upgrading from version 1.x? [Read the migration guide](https://github.com/waysact/webpack-subresource-integrity/blob/main/MIGRATE-v1-to-v5.md).**

## Features

- Optional integration with [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).
- Automatic support for dynamic imports (also known as code splitting.)
- Compatible with Webpack 5 (for Webpack versions 1-4 see [1.x branch](https://github.com/waysact/webpack-subresource-integrity/tree/1.x/).)

## Installation

```shell
yarn add --dev webpack-subresource-integrity
```

```shell
npm install webpack-subresource-integrity --save-dev
```

### Recommended Webpack Configuration

```javascript
import { SubresourceIntegrityPlugin } from "webpack-subresource-integrity";
// or: const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');

const compiler = webpack({
  output: {
    // the following setting is required for SRI to work:
    crossOriginLoading: "anonymous",
  },
  plugins: [new SubresourceIntegrityPlugin()],
});
```

### Setting the `integrity` attribute for top-level assets

For the plugin to take effect it is **essential** that you set the
`integrity` attribute for top-level assets (i.e. assets loaded by your
HTML pages.)

#### With HtmlWebpackPlugin

When html-webpack-plugin is injecting assets into the template (the
default), the `integrity` attribute will be set automatically. The
`crossorigin` attribute will be set as well, to the value of
`output.crossOriginLoading` webpack option. There is nothing else to
be done.

#### With HtmlWebpackPlugin({ inject: false })

When you use html-webpack-plugin with `inject: false`, you are
required to set the `integrity` and `crossorigin` attributes in your
template as follows:

```ejs
<% for (let index in htmlWebpackPlugin.files.js) { %>
  <script
     src="<%= htmlWebpackPlugin.files.js[index] %>"
     integrity="<%= htmlWebpackPlugin.files.jsIntegrity[index] %>"
     crossorigin="<%= webpackConfig.output.crossOriginLoading %>"
  ></script>
<% } %>

<% for (let index in htmlWebpackPlugin.files.css) { %>
  <link
     rel="stylesheet"
     href="<%= htmlWebpackPlugin.files.css[index] %>"
     integrity="<%= htmlWebpackPlugin.files.cssIntegrity[index] %>"
     crossorigin="<%= webpackConfig.output.crossOriginLoading %>"
  />
<% } %>
```

#### Without HtmlWebpackPlugin

The correct value for the `integrity` attribute can be retrieved from
the `integrity` property of Webpack assets. For example:

```javascript
compiler.plugin("done", (stats) => {
  const integrityValues = stats
    .toJson()
    .assets.map((asset) => [asset.name, asset.integrity]);
});
```

Note that when you add the `integrity` attribute on your `link` and
`script` tags, you're also required to set the `crossorigin`
attribute. It is recommended to set this attribute to the same value
as the webpack `output.crossOriginLoading` configuration option.

### Web Server Configuration

If your page can be loaded through plain HTTP (as opposed to HTTPS),
you must set the `Cache-Control: no-transform` response header or your
page will break when assets are loaded through a transforming
proxy. [See below](#proxies) for more information.

When using caching, stale assets will fail to load since they will not pass
integrity checks. It is vital that you configure caching correctly in your web
server. [See below](#caching) for more information.

### Options

#### hashFuncNames

Default value: `["sha384"]`

An array of strings, each specifying the name of a hash function to be
used for calculating integrity hash values.

See [SRI: Cryptographic hash functions](http://www.w3.org/TR/SRI/#cryptographic-hash-functions)

The default is chosen based on the current [suggestion by the
W3C](https://www.w3.org/TR/2016/REC-SRI-20160623/#hash-collision-attacks) which
reads:

> At the time of writing, SHA-384 is a good baseline.

See [here](https://github.com/w3c/webappsec/issues/477) for additional
information on why SHA-384 was chosen by the W3C over their initial suggestion,
SHA-256.

As one of the commenters in that discussion points out, "SRI hashes are likely
delivered over SSL" which today (2021) is often using SHA-256 so that there is
probably little harm in downgrading this to `sha256` instead.

By using SHA-256 you will save 21 bytes per chunk and perhaps a few CPU cycles,
although SHA-384 is actually faster to compute on some hardware. Not that it
matters, as the difference is dwarfed by all the other work a browser has to do
in order to download and parse a JS or CSS asset.

You probably want to use `sha512` instead of the default only if you're
paranoid. It will cost you an additional 21 bytes per chunk; the CPU overhead is
virtually nil because SHA-512 is the same as SHA-384, just not truncated.

Although you can specify multiple hash functions here, doing so is pointless as
long as all mainstream browsers only support the SHA-2 family, which is the case
today. Worse, it's detrimental since it adds unnecessary overhead.

The reason is that as per the spec, only the strongest hash function is used and
so eg. `['sha256', 'sha512']` is equivalent to `['sha512']` unless SHA-512 was
one day deemed _weaker_ than SHA-256 by user agents, which is an unlikely
scenario. As one of the authors of the W3C spec [puts
it](https://github.com/mozilla/srihash.org/issues/155#issuecomment-259800503):

> The support for multiple hashes is in the spec for backward-compatibility once
> we introduce new hash algorithms (e.g. SHA3).

#### enabled

Default value: `"auto"`

One of `"auto"`, `true`, or `false`.

`true` means to enable the plugin and `false` means to disable it.

`auto` is the default and means to enable the plugin when the [Webpack
mode](https://webpack.js.org/configuration/mode/) is `production` or
`none` and disable it when it is `development`.

#### hashLoading

Default value: `"eager"`

One of `"eager"` or `"lazy"`

`"eager""` means that integrity hashes for all assets will be defined in the entry chunk.

`"lazy"` means that integrity hashes for any given asset will be defined in its direct parents 
in the chunk graph. This can lead to duplication of hashes across assets, but can significantly
reduce the size of your entry chunk(s) if you have a large number of async chunks.

## Exporting `integrity` values

You might want to export generated integrity hashes, perhaps for use
with SSR. We recommend
[webpack-assets-manifest](https://github.com/webdeveric/webpack-assets-manifest)
for this purpose. When configured with option `integrity: true` it
will include the hashes generated by this plugin in the manifest.

[Example usage with webpack-assets-manifest](https://github.com/waysact/webpack-subresource-integrity/tree/main/examples/webpack-assets-manifest/).

## Caveats

### Caching

Using SRI presents a potential risk to the availability of your website when
HTTP response caching is setup incorrectly. Stale asset versions are always
problematic but SRI exacerbates the risk.

Without SRI, inconsequential changes (such as whitespace-only changes) don't
matter, and your website might still look OK when a stale CSS asset is used.
Even with a stale JS asset there's a chance your website will still be more or
less working as expected.

With SRI, however, a stale asset will fail hard. This is because the browser
won't tell the difference between a version of your asset that has been tampered
with and one that is simply outdated: both will fail the integrity check and
refuse to load.

It's therefore imperative that, if you do use caching, you use a robust setup:
one where _any_ change in content, no matter how miniscule or inconsequential,
will cause the cache to be invalidated.

With Webpack and long-term caching this means using `[contenthash]` (with
`realContentHash`, which is enabled by default in production mode). Using
`[contenthash]` with `realContentHash` disabled, or using a different type of
hash placeholder (such as `[chunkhash]`) provides weaker guarantees, which is
why this plugin will output a warning in these cases. See [issue
#162](https://github.com/waysact/webpack-subresource-integrity/issues/162)
for more information.

### Proxies

By its very nature, SRI can cause your page to break when assets are
modified by a proxy. This is because SRI doesn't distinguish between
malicious and benevolent modifications: any modification will prevent
an asset from being loaded.

Notably, this issue can arise when your page is loaded through
[Chrome Data Saver](https://developer.chrome.com/multidevice/data-compression).

This is only a problem when your page can be loaded with plain HTTP,
since proxies are incapable of modifying encrypted HTTPS responses.

Presumably, you're looking to use SRI because you're concerned about
security and thus your page is only served through HTTPS anyway.
However, if you really need to use SRI and HTTP together, you should
set the `Cache-Control: no-transform` response header. This will
instruct all well-behaved proxies (including Chrome Data Saver) to
refrain from modifying the assets.

### Preloading

This plugin adds the integrity attribute to `<link rel="preload">`
tags, but preloading with SRI doesn't work as expected in current
Chrome versions. The resource will be loaded twice, defeating the
purpose of preloading. This problem doesn't appear to exist in
Firefox or Safari. See [issue
#111](https://github.com/waysact/webpack-subresource-integrity/issues/111)
for more information.

### Browser support

Browser support for SRI is widely implemented. Your page will still
work on browsers without support for SRI, but subresources won't be
protected from tampering.

See [Can I use Subresource Integrity?](http://caniuse.com/#feat=subresource-integrity)

### Hot Reloading

This plugin can interfere with hot reloading and therefore should be
disabled when using tools such as `webpack-dev-server`. This shouldn't
be a problem because hot reloading is usually used only in development
mode where SRI is not normally needed.

For testing SRI without setting up a full-blown web server, consider
using a tool such as [`http-server`](https://github.com/indexzero/http-server).

### Safari and Assets that Require Cookies

As detailed in
[Webpack Issue #6972](https://github.com/webpack/webpack/issues/6972),
the `crossOrigin` attribute can break loading of assets in certain
edge cases due to a bug in Safari. Since SRI requires the
`crossOrigin` attribute to be set, you may run into this case even
when source URL is same-origin with respect to the asset.

## Further Reading

- [MDN: Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

## License

Copyright (c) 2015-present Waysact Pty Ltd

MIT (see [LICENSE](LICENSE))

[tests-badge]: https://github.com/waysact/webpack-subresource-integrity/actions/workflows/test.yml/badge.svg?branch=main
[tests-url]: https://github.com/waysact/webpack-subresource-integrity/actions
[coverage-badge]: https://coveralls.io/repos/github/waysact/webpack-subresource-integrity/badge.svg?branch=main
[coverage-url]: https://coveralls.io/github/waysact/webpack-subresource-integrity?branch=main
[codeclimate-badge]: https://codeclimate.com/github/waysact/webpack-subresource-integrity/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/waysact/webpack-subresource-integrity
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/waysact/webpack-subresource-integrity/main/LICENSE
