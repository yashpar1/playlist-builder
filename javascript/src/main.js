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
  const playlists = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  while (playlists.next != null) {
    const new_playlists = await fetch(playlists.next, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    playlists.push(new_playlists);
  }

  return await playlists.json();
}

function returnPlaylists(playlists) {
  const names = playlists.items?.map( (items) => items.name);
  const ids = playlists.items?.map( (items) => items.id);
  return { names, ids };
}

async function getSongs(playlist_id) {
  const playlist_info = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=next%2Citems%28track%28name%2Cartists%28name%29%29%29&limit=50`, {
    method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
  });

  while (playlist_info.next != null) {
    const new_playlist_info = await fetch(playlist_info.next, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    playlist_info.push(new_playlist_info);
  }

  return await playlist_info.json();
}

async function getFeats(songs) {
  let i_max = Math.ceil(songs.length/100);
  let i_init = 0;
  const feats = {};

  while (i_init < i_max) {
    let curr_songs = songs.slice(100 * i_init, 100 * (i_init + 1));
    const new_feats = await fetch(`https://api.spotify.com/v1/audio-features?ids=${curr_songs}`, {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    feats.push(new_feats);
    i_init++;
  };

  return await feats.json();
}

function showPlaylists(playlists) {
  let plays = returnPlaylists(playlists);
  let names = plays.names;
  let ids = plays.ids;

  let ul = document.createElement('ul');
  let li = document.createElement('li');

  document.getElementById('profile').appendChild(ul);

  names?.forEach((playlist) => {
    li.innerHTML += playlist;
    ul.appendChild(li);
    li = document.createElement('li');
  });

  ids?.forEach(async (id) => {
    const songs = await getSongs(id);
    li.innerHTML += songs.items.map( (items) => items.track.name );
    ul.appendChild(li);
    li = document.createElement('li');
  });
}


function populateUI(profile, playlists) {
  document.getElementById("displayName").innerText = profile.display_name;
  if (profile.images[0]) {
      const profileImage = new Image(200, 200);
      profileImage.src = profile.images[0].url;
      document.getElementById("avatar").appendChild(profileImage);
      document.getElementById("imgUrl").innerText = profile.images[0].url;
  }

  showPlaylists(playlists);

  document.getElementById("id").innerText = profile.id;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("uri").innerText = profile.uri;
  document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);
  document.getElementById("url").innerText = profile.href;
}