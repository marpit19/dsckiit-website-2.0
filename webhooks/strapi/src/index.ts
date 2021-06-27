import type { ServerRoute } from '@hapi/hapi';

import server, { indexRoute } from './bootstrap';
import { discordRoutes } from './discord';

const routes: ServerRoute[] = [indexRoute, ...discordRoutes];

async function start() {
	await server.start();
	console.log(`Starting ${process.env.NODE_ENV} server ...`);
	server.route(routes);
	return server;
}

start();

process.on('unhandledRejection', (err) => {
	console.log('CRITICAL ERROR \n\n', err);
});
