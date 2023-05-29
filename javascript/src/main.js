import './../style.css'
const clientId = '3d05de7a35df4db0a064b4e40d9c6638';
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

export const accessToken = await getAccessToken(clientId, code);

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const profile = await fetchProfile(accessToken);
    const playlists = await fetchPlaylists(accessToken);
    populateUI(profile, playlists);
}

export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173");
  params.append("scope", "user-read-private user-read-email playlist-read-private");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
}


export async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
  });

  const { access_token } = await result.json();
  return access_token;
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

async function fetchPlaylists(token) {
  const result = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
}

function returnPlaylists(playlists) {
  const plays = playlists.items?.map(getNames);
  const ids = playlists.items?.map(getIds);
  return plays;
  // to do: get playlist ids, return both as object, rework html loop to call names from objects
}

function getNames(playlist) {
  return playlist.name;
}

function getIds(playlist) {
  return playlist.id;
}

async function getSongs(playlist) {
  const songs = await fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks?fields=next%2Citems%28track%28id%2Cname%2Cartists%28name%29%29%29&limit=50`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return songs;
}

async function getFeats(songs) {
  const feats = await fetch(`https://api.spotify.com/v1/audio-features?ids=${songs}`, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return feats;
}


function populateUI(profile, playlists) {
  document.getElementById("displayName").innerText = profile.display_name;
  if (profile.images[0]) {
      const profileImage = new Image(200, 200);
      profileImage.src = profile.images[0].url;
      document.getElementById("avatar").appendChild(profileImage);
      document.getElementById("imgUrl").innerText = profile.images[0].url;
  }

  let items = returnPlaylists(playlists);

  let ul = document.createElement('ul');

  // Make the list item
  let li = document.createElement('li');

  document.getElementById('profile').appendChild(ul);

  items?.forEach((playlist) => {
    // Add the item text
    li.innerHTML += playlist;

    // Add li to the ul
    ul.appendChild(li);

    // Reset the list item
    li = document.createElement('li');
  });

  document.getElementById("id").innerText = profile.id;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("uri").innerText = profile.uri;
  document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);
  document.getElementById("url").innerText = profile.href;
}