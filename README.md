# Koa Router
A class for creating Koa middlewares that route requests based on the request URL.

This middleware, at this time, is essentially a wrapper for [@koa/router](https://www.npmjs.com/package/@koa/router) that simply serves to offer the same functionality in a form factor similar to other Donut Team Koa middlewares.

**Note**: There are some features of @koa/router that are not convenient to use with this package, such as nested routers, that we don't personally care about when developing Donut Team web services.

## Installation
Install the package with NPM:

```
npm install @donutteam/koa-router
```

## Usage
To use this class, simply instantiate an instance and add it to your Koa stack:

```js
import Koa from "koa";

import { RouterMiddleware } from "@donutteam/koa-router";

const app = new Koa();

// You may want to export the router and register your
// routes within the files that actually contain their code
export const routerMiddleware = new RouterMiddleware();

// Be sure to add the execute function on the instance
// and NOT the instance itself
app.use(routerMiddleware.execute);
```

## Options
### koaRouter
Options for the underlying @koa/router.

See [this page](https://github.com/koajs/router/blob/HEAD/API.md#new-routeropts) for more details.

## Methods
### execute
The middleware function to be passed to Koa.

### router
The `router` object is an instance of @koa/router so all of the same methods apply there.

See [this page](https://github.com/koajs/router/blob/HEAD/API.md#routergetputpostpatchdeletedel--coderoutercode) for more details.

## License
[MIT](https://github.com/donutteam/koa-router/blob/main/LICENSE.md)