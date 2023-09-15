export async function getSongs(playlistId, token) {
  const playlistInfo = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=total%2Cnext%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await playlistInfo.json();
};

// to-do: get the while loop iterating over next (which shows up, but as a promise so we need to figure out .then chaining)
export async function getMoreSongs(playlistInfo, token) {
  let next = playlistInfo.map( (playlistInfo) => playlistInfo.next);
  console.log(next);
  let newSongs = [];
  while (next != null) {
    let newPlaylistInfo = await fetch(encodeURI(next), {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    newSongs.push(newPlaylistInfo);
  }
  console.log(newSongs);

  return await Object.assign({}, playlistInfo, newSongs);
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