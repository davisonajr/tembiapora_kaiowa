import { RefreshingAuthProvider } from '@twurple/auth';
import { getToken } from '@/auth/exchangeToken';

const code = import.meta.env.VITE_TWITCH_CODE;
let tokenData = null;

if (code) {
  tokenData = await getToken(code);
  // Aqui você pode continuar com a configuração do authProvider
}

const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
const clientSecret = import.meta.env.VITE_TWITCH_CLIENT_SECRET;

const authProvider = new RefreshingAuthProvider(
  {
    clientId,
    clientSecret
  }
);

authProvider.onRefresh(async (userId, newTokenData) => {
  // Armazene os dados do novo token no localStorage
  localStorage.setItem(`twitch_token`, JSON.stringify(newTokenData, null, 4));
});

// Adiciona o usuário pelo token existente
if (tokenData) {
  await authProvider.addUserForToken(tokenData, ['chat']);
}

export default authProvider;
