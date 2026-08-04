const CLIENT_ID =
  "122698212064-417ro6727cp119ai69qalc276rkovb20.apps.googleusercontent.com";

const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/youtube",
].join(" ");

const STORAGE_KEY = "user";

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

  const profileResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!profileResponse.ok) {
    throw new Error("Failed to fetch user profile.");
  }

  const profile = await profileResponse.json();

  const user = {
    accessToken,
    profile: {
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
    },
  };

  await chrome.storage.local.set({
    [STORAGE_KEY]: user,
  });

  return user;
}

async function getStoredUser() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] ?? null;
}

export async function logout() {
  const user = await getStoredUser();

  if (user?.accessToken) {
    try {
      await fetch(
        `https://oauth2.googleapis.com/revoke?token=${user.accessToken}`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error("Failed to revoke token:", error);
    }
  }

  await chrome.storage.local.remove(STORAGE_KEY);
}

export async function validateStoredUser() {
  const user = await getStoredUser();

  if (!user) {
    return null;
  }

  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      await chrome.storage.local.remove(STORAGE_KEY);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to validate user:", error);
    await chrome.storage.local.remove(STORAGE_KEY);
    return null;
  }
}
