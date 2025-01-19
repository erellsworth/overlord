import { Request, Response } from 'express';
import { Agent } from '@atproto/api';
import atproRouter from './router';
import { getAtproClient } from '@apiUtils/atpro';

atproRouter.get(
  '/atpro/client-metadata',
  async (req: Request, res: Response) => {
    const client = await getAtproClient();
    res.json(client.clientMetadata);
  },
);

atproRouter.get('/atpro/jwks', async (req: Request, res: Response) => {
  const client = await getAtproClient();
  res.json(client.jwks);
});

atproRouter.get('/atpro/callback', async (req: Request, res: Response) => {
  const client = await getAtproClient();

  const params = new URLSearchParams(req.url.split('?')[1]);

  const { session, state } = await client.callback(params);

  // Process successful authentication here
  console.log('authorize() was called with state:', state);

  console.log('User authenticated as:', session.did);

  const agent = new Agent(session);
  if (agent.did !== undefined) {
    // Make Authenticated API calls
    const profile = await agent.getProfile({ actor: agent.did });
    console.log('Bsky profile:', profile.data);
  }

  res.json({ ok: true });
});

export default atproRouter;
