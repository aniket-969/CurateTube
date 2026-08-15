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
  const tokenInfoResponse = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
  );

  const tokenInfo = await tokenInfoResponse.json();

  console.log("TOKEN INFO:", tokenInfo,accessToken);

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
  console.log("[Auth] Starting stored user validation...");

  const user = await getStoredUser();

  if (!user) {
    console.log("[Auth] No stored user found.");
    return null;
  }

  console.log("[Auth] Stored user found:", {
    email: user.profile?.email,
    name: user.profile?.name,
    hasAccessToken: !!user.accessToken,
  });

  try {
   
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    console.log("[Auth] Userinfo response:", response.status, response.statusText);

    if (!response.ok) {
      console.log("[Auth] Access token is invalid/expired. Logging out.");
      await logout();
      return null;
    }

    const tokenInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${user.accessToken}`
    );

    console.log(
      "[Auth] Token info response:",
      tokenInfoResponse.status,
      tokenInfoResponse.statusText
    );

    if (!tokenInfoResponse.ok) {
      console.log("[Auth] Failed to retrieve token information. Logging out.");
      await logout();
      return null;
    }

    const tokenInfo = await tokenInfoResponse.json();

    console.log("[Auth] Token info:", {
      scope: tokenInfo.scope,
      expiresIn: tokenInfo.expires_in,
      email: tokenInfo.email,
    });

    const grantedScopes = tokenInfo.scope?.split(" ") ?? [];

    console.log("[Auth] Granted scopes:", grantedScopes);

    const requiredYoutubeScope =
      "https://www.googleapis.com/auth/youtube";

    const hasYoutubeAccess = grantedScopes.includes(requiredYoutubeScope);

    console.log("[Auth] YouTube scope required:", requiredYoutubeScope);
    console.log("[Auth] YouTube scope granted:", hasYoutubeAccess);

    if (!hasYoutubeAccess) {
      console.log(
        "[Auth] YouTube permission missing. Clearing stored user and logging out."
      );

      await logout();

      console.log("[Auth] Stored user cleared.");
      return null;
    }

    console.log("[Auth] User validation successful:", user.profile?.email);

    return user;
  } catch (error) {
    console.error("[Auth] Failed to validate user:", error);

    console.log("[Auth] Clearing stored user due to validation error.");
    await logout();

    return null;
  }
}
