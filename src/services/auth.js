export async function login() {
    console.log("trying to login")
  try {
    const token = await chrome.identity.getAuthToken({
      interactive: true,
    });

    if (!token) {
        console.log("Token nahi hai")
      throw new Error("Failed to retrieve access token.");
    }
console.log("reached just before return")
    return {
      accessToken: token,
    };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
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