# grainstack

> A succinct (API-first) way of building fine-grained, three-tier web apps.

### What

This is an alternative stack for building web apps.

* `grainstack` - Run `npx grainstack` to create a three-tier app.
* `grainbox` : `react` - Front-end framework providing reactive updates.
* `jsx-to-hyperscript` : `babel` - JSX support by transforming it to `hyperscript`.
* `web-imports` : `webpack` - Support for resolving dependencies of dependencies.
* `cleanbean` - A client-side graphql interface with minimal API surface area.

### Why

The goal is to reduce JavaScript fatigue. Instead of being exposed to NPM, babel, and webpack your first time building a web app, instead, all you need is beginner understanding of vanilla HTML, JS, and CSS to start, and there is a gradual path towards increasing the complexity of the project until it is a three-tier app completed with a database, server, and client. That path is laid out by `grainstack`.

ES modules in the browser was a major advancement in web technology 
that paved the way for isomorphic code sharing and a bundle-less developer experience that reduced complexity and overhead.
It suddenly became possible to use packages without a compile step, 
resulting in a leaner project space.

Packages like `htm` and `hyperscript` allowed for a react-like developer experience in vanilla JS. So `grainbox` was created to provide the reactivity solution, and then it was possible to make a reactive SPA using only built-in language features. "Bundl-ation" not needed.

However, in vanilla JS some features are still missing which are worth installing such as typing, JSX, and the ability to access a thriving package ecosystem.

Additional features are added by introducing a build or compilation step,
and if `babel` is no longer needed for JSX transformation, 
then it can be removed from the project in some cases.

Some common build steps are:

1. Support type annotations.
2. Support JSX.
3. Support importing from `node_modules` and dependencies of dependencies.

Covering these common use cases means that many projects might not need plugin systems such as `babel` or `webpack` anymore.

### Stack Features

* Minimal API surface area so there is less code to write for developers.
* Front-end packages have a low number of dependencies so less import requests are made between the browser and server.
* Front-end package and their dependencies have small sizes for faster download speed.
* HTML, CSS, and JS are co-located in the same JS file.
* Lightweight, being able to create an SPA without NPM if you would like to. Allows you to add weight ad-hoc. Need JSX? Add a build step. Need type coverage? Add a build step. Need a backend? Add a build step. This should reduce JS fatigue because it is possible to ease into the JS ecosystem.

## A Three-Tier SPA

A single page application requires these parts:

* [File Serving](./docs/file-serving.md)
* Dependencies - Import from `node_modules` in the browser using [`web-imports`](https://npmjs.com/web-imports)
* HTML solution - JSX using [`jsx-to-hyperscript`](https://npmjs.com/jsx-to-hyperscript)
* CSS - I recommend using [`import {css} from 'goober'`](https://www.npmjs.com/package/goober) 
* [Reactivity](https://www.npmjs.com/package/grainbox)
* [History](https://github.com/grainstackdev/grainbox/blob/HEAD/docs/history.md)
* [Routing](https://github.com/grainstackdev/grainbox/blob/HEAD/docs/routing.md)

Running `npx grainstack` will setup a project with all of the above.

## Compilers and Bundlers

One goal of the project is to bridge the gap as much as possible between the kinds of things you can make without NPM, babel, and webpack. 

One interesting thing I have found it has enabled me to do is easily share code between the front-end and back-end. Taking advantage of the isomorphic feature of ES Modules, all I had to do was import and it was available.

Another notable feature is the ability to serve html pages through a CDN. This can be useful for making demos easily. 

## JSX

Supporting JSX will require compilation until it becomes part of the browser.

If you would like to use JSX instead of `html` template tag literals, you can do so using the [`jsx-to-hyperscript`](https://www.npmjs.com/package/jsx-to-hyperscript) package. Then, `h` must be present in any file which has JSX. This is similar to how `React` has to be present in any file which has JSX.

```js
// These imports are analogous to each other with respect to JSX being present in the file.  
import {React} from 'react'
import {h} from 'grainstack'

// `jsx-to-hyperscript` will transforms this into: const element = h('div')
const element = <div/>
```

## Suitability

Which kinds of projects would work best with `grainstack`?

* prototypes
* demos
* small scale

`grainstack` has not been tested on large projects.
