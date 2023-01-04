//
// Imports
//

import KoaRouter from "@koa/router";

import { Middleware } from "koa";

//
// Exports
//

export interface RouterMiddlewareOptions
{
	/** Options passed down to the internal Koa router. */
	koaRouter? : KoaRouter.RouterOptions;
}

/** A class for creating Koa middlewares that route requests based on the request URL. */
export class RouterMiddleware
{
	/** The middleware function. */
	execute : Middleware;

	/** The actual router used to register routes. */
	router : KoaRouter;

	constructor(options? : RouterMiddlewareOptions)
	{
		this.router = new KoaRouter(options?.koaRouter);

		this.execute = this.router.routes();
	}
}