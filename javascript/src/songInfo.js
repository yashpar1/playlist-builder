function fixUris(uri) {
  let fixed = uri.substring(0, uri.indexOf('&locale')).replaceAll('(', '%28').replaceAll(')', '%29').replaceAll(',','%2C');
  console.log(fixed);
  return fixed;
};

// to-do: update so that this handles when we're outta items and when next is null; that'd be fine if we were just
// logging to console but we needa pass things so
async function* getSongs(uri, token) {                                                                                      
  while (true) {
    yield await fetch(uri, {method: "GET", headers: {Authorization: `Bearer ${token}`}}).then((resp) => resp.json()).then((info) => {
      if (info.items && info.items.length > 0) {
        uri = fixUris(info.next);
        return info;
      } else {
        return null;
      }
    });                                                                                                                                                
  }                                                                                                                                         
};

export function compileSongs(playlistId, token, opts) {                                                                                                                                     
  let initialUri = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=total%2Cnext%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29`;
  if (!opts.hasOwnProperty('info')) {
    opts.info = [];
  };

  if (!opts.hasOwnProperty('logs')) {
    opts.logs = getSongs(initialUri, token);
  };

  let { logs, info, onComplete } = opts;
  let next = logs.next();

  next.value.then(data => {
    if (data) {
      info = info.concat(data.items);
      console.log(info);
      compileSongs(playlistId, token, {logs, info, onComplete});
    } else {
      onComplete(info);
    };
  });
}  
  
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