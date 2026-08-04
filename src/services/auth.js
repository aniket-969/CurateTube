const CLIENT_ID =
  "122698212064-erds8d2qht5snctlfhsdd0hs8njjgnt6.apps.googleusercontent.com";

const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
].join(" ");

export async function login() {
  const redirectUri = chrome.identity.getRedirectURL();

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "token",
      redirect_uri: redirectUri,
      scope: SCOPES,
      prompt: "consent",
    });

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  });

  if (!responseUrl) {
    throw new Error("Login failed.");
  }

  const hash = new URL(responseUrl).hash.substring(1);
  const params = new URLSearchParams(hash);

  const accessToken = params.get("access_token");

  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  return {
    accessToken,
  };
}

export async function logout() {
  try {
    const { token } = await chrome.identity.getAuthToken({
      interactive: false,
    });

    if (!token) return;

    await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
      method: "POST",
    });

    await chrome.identity.removeCachedAuthToken({ token });
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}