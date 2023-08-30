export async function getSongs(playlist_id, token) {
  const playlistInfo = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=next%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29&limit=50`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  while (playlistInfo.next != null) {
    let newPlaylistInfo = await fetch(playlistInfo.next, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    playlistInfo.push(newPlaylistInfo);
  }

  return await playlistInfo.json();
};
  
export async function getFeats(songs, token) {
  let ids = songs.items.map( (items) => items.track.id );
  let iMax = Math.ceil(ids.length/100);
  let i = 0;
  const feats = [];

  while (i < iMax) {
    let currSongs = ids.slice(100 * i, 100 * (i + 1));
    let newFeats = await fetch(`https://api.spotify.com/v1/audio-features?ids=${currSongs}`, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    feats.push(newFeats);
    i++;
  };

  return await { ids, feats };
};