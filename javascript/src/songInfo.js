function fixUris(uri) {
  let fixed = uri.substring(0, uri.indexOf('&locale')).replaceAll('(', '%28').replaceAll(')', '%29').replaceAll(',','%2C');
  return fixed;
};

function* getSongs(uri, token) {
  while (uri != null) {
    yield fetch(uri, {method: "GET", headers: {Authorization: `Bearer ${token}`}}).then(resp => resp.json()).then(info => {
      uri = info.next;
      return info;
    });
  }
};

// this needs to be run as a forEach
export function compileSongs(playlistId, token, opts) {
  let initialUri = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=total%2Cnext%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29`;
  
  if (!opts.hasOwnProperty('info')) {
    opts.info = [];
  };

  if (!opts.hasOwnProperty('logs')) {
    opts.logs = getSongs(initialUri, token);
  };

  let { logs, info, onComplete } = opts;
  let next = logs.next().value;

  if (next != undefined) {
    next.then(data => {
      info = info.concat(data);
      compileSongs(playlistId, token, {logs, info, onComplete});
    });
  } else {
    onComplete(info);
  }
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