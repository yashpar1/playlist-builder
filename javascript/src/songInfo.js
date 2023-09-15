export async function getSongs(playlistId, token) {
  const playlistInfo = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=total%2Cnext%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await playlistInfo.json();
};

function fixUris(uri) {
  return uri.substring(0, uri.indexOf('&locale')).replaceAll('(', '%28').replaceAll(')', '%29').replaceAll(',','%2C')
};

// to-do: change into map that acts on individual playlists
export async function getMoreSongs(playlistInfo, token) {
  let next = playlistInfo.map( (playlistInfo) => playlistInfo.next);
  console.log(next);
  let newSongs = [];
  for (let playlist in next) {
    let nextUri = next[playlist];
    if (nextUri != null) {
      let uri = fixUris(nextUri);
      let newPlaylistInfo = await fetch(uri, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
      });
      newSongs.push(newPlaylistInfo);
      // nextUri = fixUris(newPlaylistInfo.map( (playlistInfo) => playlistInfo.next))
    } else {
      newSongs.push(null);
    }
  };

  let toAdd = Promise.all(newSongs);
  console.log(toAdd);

  return await playlistInfo;
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