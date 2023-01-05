//
// Imports
//

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import KoaRouter from "@koa/router";
import { Middleware } from "koa";

//
// Middleware
//

export interface RouterMiddlewareOptions
{
	/** Options passed down to the internal Koa router. */
	koaRouter? : KoaRouter.RouterOptions;
}

export interface RouterMiddlewareLoadRouteOptions
{
	/** An array of directory names that should be ignored. */
	excludedDirectoryNames? : string[];

	/** An array of file names that should be ignored. */
	excludedFileNames? : string[];
}

export interface RouterMiddlewareRoute
{
	/** The route's path. */
	routePath : string;

	/** An array of middleware used for GET requests to this route. */
	routeGetMiddlewares? : Middleware[];

	/** The main function for GET requests to this route. */
	routeGet? : Middleware;

	/** An array of middleware used for POST requests to this route. */
	routePostMiddlewares? : Middleware[];

	/** The main function for POST requests to this route. */
	routePost? : Middleware;
}

/** A class for creating Koa middlewares that route requests based on the request URL. */
export class RouterMiddleware
{
	/** The middleware function. */
	execute : Middleware;

	/** The actual router used to register routes. */
	router : KoaRouter;

	/** @author Loren Goodwin */
	constructor(options? : RouterMiddlewareOptions)
	{
		this.router = new KoaRouter(options?.koaRouter);

		this.execute = this.router.routes();
	}

	/**
	 * Loads all routes in the given directory.
	 * 
	 * @returns The number of routes loaded.
	 * @author Loren Goodwin
	 */
	async loadRoutes(directory : string, options? : RouterMiddlewareLoadRouteOptions) : Promise<number>
	{
		const directoryEntries = await fs.promises.readdir(directory,
			{
				withFileTypes: true,
			});

		let numberOfRoutesLoaded = 0;

		for (const entry of directoryEntries)
		{
			const entryPath = path.join(directory, entry.name);

			if (entry.isDirectory())
			{
				if (options?.excludedDirectoryNames != null && options.excludedDirectoryNames.indexOf(entry.name) != -1)
				{
					continue;
				}

				numberOfRoutesLoaded += await this.loadRoutes(entryPath);
			}
			else
			{
				if (options?.excludedFileNames != null && options.excludedFileNames.indexOf(entry.name) != -1)
				{
					continue;
				}

				const parsedPath = path.parse(entryPath);
		
				if (parsedPath.ext != ".js")
				{
					return;
				}

				try
				{
					await this.loadRoute(entryPath);

					numberOfRoutesLoaded += 1;
				}
				catch(error)
				{
					console.error(`[RouterMiddleware] Error loading route from ${ entryPath }:`, error);
				}
			}
		}

		return numberOfRoutesLoaded;
	}

	/**
	 * Loads the route at the given part.
	 * 
	 * @author Loren Goodwin
	 */
	async loadRoute(entryPath : string) : Promise<void>
	{
		const route = await import(url.pathToFileURL(entryPath).toString()) as RouterMiddlewareRoute;

		if (route.routePath == null)
		{
			return;
		}

		if (route.routeGet != null)
		{
			const middleware = 
			[
				...(route.routeGetMiddlewares ?? []),

				route.routeGet,
			];

			this.router.get(route.routePath, ...middleware);

			console.log(`[Server] Registered GET ${ route.routePath }`);
		}

		if (route.routePost != null)
		{
			const middleware = 
			[
				...(route.routePostMiddlewares ?? []),

				route.routePost,
			];

			this.router.post(route.routePath, ...middleware);

			console.log(`[Server] Registered POST ${ route.routePath }`);
		}
	}
}