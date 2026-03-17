import Ably from 'ably';

let ablyClient: Ably.Realtime | null = null;

export const getAblyClient = () => {
  if (ablyClient) return ablyClient;

  ablyClient = new Ably.Realtime({
    authUrl: '/api/ably/auth',
    autoConnect: true,
  });

  return ablyClient;
};

export const disconnectAbly = () => {
  if (ablyClient) {
    ablyClient.close();
    ablyClient = null;
  }
};
