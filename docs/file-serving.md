## Serving Front-End JS

Importing from `node_modules` requires compilation. Note that if the browser were able to handle imports with bare specifiers (maybe it can be configured one day), then compilation can be eliminated for this feature.

Serving files which have been transformed by [`web-imports`](https://www.npmjs.com/package/web-imports) is highly recommended. Similar to how `jsx-to-hyperscript` provides an improved developer experience (DX) by introducing JSX, `web-imports` improves DX by allowing the browser to import from `node_modules` by transforming the code. It can be used in both SSG and SSR contexts. See the `web-imports` documentation for more information.

### SSG

In static site generation, a copy of `node_modules` should be deployed alongside the project files.

### SSR

`npx grainstack` will set this up for you using [`serverless`](https://npmjs.com/serverless).

## List of CDNs

* [esm.run](https://esm.run)
* [unpkg.com](https://unpkg.com)
* [skypack](https://www.skypack.dev/)
* [cdnjs](https://cdnjs.com/)
