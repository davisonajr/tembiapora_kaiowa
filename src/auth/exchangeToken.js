import { exchangeCode } from '@twurple/auth';

const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
const clientSecret = import.meta.env.VITE_TWITCH_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_TWITCH_REDIRECT_URI;

export async function getToken(code) {
  try {
    const tokenData = await exchangeCode(clientId, clientSecret, code, redirectUri);
    // Armazene o token no localStorage ou em outro lugar
    localStorage.setItem('twitch_token', JSON.stringify(tokenData));
    return tokenData;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
  }
}