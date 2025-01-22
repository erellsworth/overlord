import { NodeOAuthClient } from '@atproto/oauth-client-node';
import { AtpAgent } from '@atproto/api';
import { JoseKey } from '@atproto/jwk-jose';
import { generateKeyPair } from 'jose';

//NOTE: Holding back on the oauth implementation until this can be deployed to a public server
// based on https://github.com/kaytwo/atproto-oauth-client-server-example

let clientInstance: NodeOAuthClient | null = null;
const stateStore = new Map();
const sessionStore = new Map();

export const getAtproAgent = async () => {
  const service = process.env.AT_PRO_SERVICE || '';
  const identifier = process.env.AT_PRO_ID || '';
  const password = process.env.AT_PRO_PASS || '';

  const agent = new AtpAgent({
    service,
  });

  await agent.login({
    identifier,
    password,
  });

  return agent;
};

export const getAtproClient = async () => {
  if (clientInstance) return clientInstance;

  // Replace with your ngrok URL
  const BASE_URL = process.env.BASE_URL;

  clientInstance = new NodeOAuthClient({
    clientMetadata: {
      client_id: `${BASE_URL}/atrpo/client-metadata`,
      client_name: 'Overlord CMS',
      client_uri: BASE_URL,
      redirect_uris: [`${BASE_URL}/atpro/callback`],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'ES256',
      scope: 'atproto',
      application_type: 'web',
      dpop_bound_access_tokens: true,
      jwks_uri: `${BASE_URL}/atpro/jwks`,
    },

    keyset: await Promise.all([
      JoseKey.fromImportable(process.env.PRIVATE_KEY_1 || ''),
      JoseKey.fromImportable(process.env.PRIVATE_KEY_2 || ''),
      JoseKey.fromImportable(process.env.PRIVATE_KEY_3 || ''),
    ]),

    stateStore: {
      async set(key: string, state: any) {
        stateStore.set(key, state);
      },
      async get(key: string) {
        return stateStore.get(key);
      },
      async del(key: string) {
        stateStore.delete(key);
      },
    },

    sessionStore: {
      async set(sub: string, session: any) {
        sessionStore.set(sub, session);
      },
      async get(sub: string) {
        return sessionStore.get(sub);
      },
      async del(sub: string) {
        sessionStore.delete(sub);
      },
    },
  });

  return clientInstance;
};

export const serializeKeyToJwk = async () => {
  // Generate an RSA key pair
  const { publicKey, privateKey } = await generateKeyPair('RS256');

  // Export keys as JWK
  const publicJwk = await import('jose').then((lib) =>
    lib.exportJWK(publicKey),
  );
  const privateJwk = await import('jose').then((lib) =>
    lib.exportJWK(privateKey),
  );

  // Convert to JSON strings
  const publicJwkString = JSON.stringify(publicJwk);
  const privateJwkString = JSON.stringify(privateJwk);

  // save 3 of these to PRIVATE_KEY_X env vars
  console.log(privateJwkString);

  return { publicJwkString, privateJwkString };
};
