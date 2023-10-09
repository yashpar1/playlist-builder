import './../style.css';
import { useEffect, useState } from 'preact/hooks';

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
};

function generateCodeVerifier(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};


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
};

export async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json();
};

export async function fetchPlaylists(token) {
  const playlists = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  while (playlists.next != null) {
    let newPlaylists = await fetch(playlists.next, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    playlists.push(newPlaylists);
  }

  return await playlists.json();
};

export function useAccessToken(clientId, code) {
    const [accessToken, setAccessToken] = useState();
    
    useEffect(() => {
	if (clientId && code) {
	    getAccessToken(clientId, code).then(accessToken => {
		setAccessToken(accessToken);
	    });
	}
	
    }, [clientId, code]);

    return accessToken;
}

export function useProfile(accessToken) {
    const [profile, setProfile] = useState();

    useEffect(() => {
	if (accessToken) {
	    fetchProfile(accessToken).then(profile => {
		setProfile(profile);
	    });
	}
    }, [accessToken]);

    return profile;
}

export function usePlaylists(accessToken) {
    const [playlists, setPlaylists] = useState();
    
    useEffect(() => {
	if (accessToken) {
	    fetchPlaylists(accessToken).then(playlists => {
		setPlaylists(playlists);
	    });
	}
    }, [accessToken]);
    
    return playlists;
}
