import { Request, Response } from 'express';
import {
  Agent,
  AppBskyEmbedExternal,
  AppBskyFeedPost,
  RichText,
} from '@atproto/api';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../utils/responses';
import atproRouter from './router';
import { getAtproAgent, getAtproClient } from '@apiUtils/atpro';
import { Content } from '../models';

atproRouter.post(
  '/atpro/share/:id',
  async (req: Request<{ id: number }, {}, { text: string }>, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
      const content = await Content.findById(id);

      if (!content) {
        return notFoundResponse(res);
      }

      const agent = await getAtproAgent();

      const rt = new RichText({ text });
      const createdAt = new Date().toISOString();
      const uri = `${process.env.FRONT_END_URL}/${process.env.FRONT_END_CONTENT_ROUTE}/${content.slug}`;

      await rt.detectFacets(agent); // automatically detects mentions and links
      const postRecord: Partial<AppBskyFeedPost.Record> &
        Omit<AppBskyFeedPost.Record, 'createdAt'> = {
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        createdAt,
        embed: {
          $type: 'app.bsky.embed.external',
          external: {
            uri,
            title: content.title,
            description: content.seo.description,
          },
        },
      };

      if (content.image && postRecord.embed && postRecord.embed.external) {
        const imageResult = await fetch(content.image.full);

        const bufferArray = await imageResult.arrayBuffer();
        const unit8Array = new Uint8Array(bufferArray);

        const { data } = await agent.uploadBlob(unit8Array);

        (postRecord.embed.external as AppBskyEmbedExternal.External).thumb =
          data.blob;
      }

      const result = await agent.post(postRecord);

      successResponse(res, result);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  },
);

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
