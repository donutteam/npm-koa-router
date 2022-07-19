//
// Imports
//

import KoaRouter from "@koa/router";

//
// Exports
//

/**
 * A class for creating Koa middlewares that route requests based on the request URL.
 */
export class RouterMiddleware
{
	/**
	 * The middleware function.
	 * 
	 * @type {import("koa").Middleware}
	 */
	execute;

	/**
	 * The actual router used to register routes.
	 *
	 * @type {KoaRouter}
	 */
	router;

	/**
	 * Constructs a new RouterMiddleware.
	 *
	 * @param {Object} [options] Options for the middleware.
	 * @param {KoaRouter.RouterOptions} [options.koaRouter] Options for the underlying Koa Router.
	 */
	constructor(options)
	{
		this.router = new KoaRouter(options?.koaRouter);

		this.execute = this.router.routes();
	}
}