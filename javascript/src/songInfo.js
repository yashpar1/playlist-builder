import { accessToken } from "./main";

export async function getSongs(playlist_id) {
  const playlistInfo = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=next%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29&limit=50`, {
    method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
  });

  while (playlistInfo.next != null) {
    let newPlaylistInfo = await fetch(playlistInfo.next, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    playlistInfo.push(newPlaylistInfo);
  }

  return await playlistInfo.json();
}
  
export async function getFeats(songs) {
  let ids = songs.items.map( (items) => items.track.id );
  let iMax = Math.ceil(ids.length/100);
  let iInit = 0;
  const feats = [];

  while (iInit < iMax) {
    let currSongs = ids.slice(100 * iInit, 100 * (iInit + 1));
    let newFeats = await fetch(`https://api.spotify.com/v1/audio-features?ids=${currSongs}`, {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    feats.push(newFeats);
    i_init++;
  };

  return await { ids, feats };
}