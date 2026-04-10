const API_BASE_URL = 'https://apitraxx.mistermind.com';

async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const authDataRaw = localStorage.getItem('auth');
  const headers = new Headers(init?.headers);

  if (authDataRaw) {
    try {
      const authData = JSON.parse(authDataRaw);
      if (authData.token) {
        headers.set('Authorization', `Bearer ${authData.token}`);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

export async function googleLogin(credential: string): Promise<any> {
  // 1. Decode Google JWT on client side to extract info
  let googleId = '';
  let email = '';
  let name = '';
  let firstName = '';
  let lastName = '';
  let pictureUrl = '';

  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    googleId = payload.sub;
    email = payload.email;
    name = payload.name;
    firstName = payload.given_name;
    lastName = payload.family_name;
    pictureUrl = payload.picture || '';
  } catch (e) {
    console.error('Error decoding Google token', e);
    throw new Error('Invalid Google credential');
  }

  const url = `${API_BASE_URL}/Auth/google-login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        GoogleId: googleId,
        Email: email,
        FullName: name,
        GivenName: firstName,
        FamilyName: lastName,
        PictureUrl: pictureUrl
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error with Google login:', error);
    throw error;
  }
}

export async function apiLogin(email: string, password: string): Promise<any> {
  const url = `${API_BASE_URL}/Auth/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error with login:', error);
    throw error;
  }
}
export async function fetchUserArtists(userId: string): Promise<any[]> {
  const url = `${API_BASE_URL}/Artist/user/${userId}/light`;

  try {
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user artists:', error);
    throw error;
  }
}
export async function generateAdvice(artistId: string, fileName: string, file: File): Promise<any> {
  const url = `${API_BASE_URL}/Advice/generate`;

  // We use binary upload as requested, sending the file as the body
  const response = await authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'X-Artist-Id': artistId,
      'X-File-Name': fileName,
      'Content-Type': file.type || 'audio/mpeg'
    },
    body: file
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
export async function fetchArtistSongs(artistId: string): Promise<any[]> {
  const url = `${API_BASE_URL}/Artist/${artistId}/songs/light`;

  try {
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching artist songs:', error);
    throw error;
  }
}
