function fixUris(uri) {
  let fixed = uri.substring(0, uri.indexOf('&locale')).replaceAll('(', '%28').replaceAll(')', '%29').replaceAll(',','%2C');
  return fixed;
};

/**
 * 
 * @param {string} uri 
 * @param {string} token
 * @returns {Promise<object[]>} 
 */
function* getSongs(uri, token) {
  while (uri != null) {
    yield fetch(uri, {method: "GET", headers: {Authorization: `Bearer ${token}`}}).then(resp => resp.json()).then(info => {
      uri = info.next;
      return info;
    });
  }
};

/**
 * 
 * @param {string} playlistId 
 * @param {string} token 
 * @returns {Promise<object[]>}
 */
export async function compileSongs(playlistId, token) {
  const initialUri = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=total%2Cnext%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29`;
  const chunks = getSongs(initialUri, token);
  let songs = [];
  let next = chunks.next().value;

  while (next != undefined) {
    const data = await next;
    songs = songs.concat(data.items);
    next = chunks.next().value;
    };

  return songs;
};

/**
 * 
 * @param {string[]} playIds 
 * @param {string} token 
 * @returns {Promise<Promise<object>[]>}
 */
export async function returnCompiledSongs(playIds, token) {
  let tracks = [];
  playIds.forEach(playId => tracks.push(compileSongs(playId, token)));
  return tracks;
};

/**
 * 
 * @param {string[]} songs 
 * @param {string} token 
 * @returns {Object}
 */
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