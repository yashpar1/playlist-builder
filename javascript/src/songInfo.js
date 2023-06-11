import { accessToken } from "./main";

export async function getSongs(playlist_id) {
    const playlist_info = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=next%2Citems%28track%28name%2Cid%2Cartists%28name%29%29%29&limit=50`, {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
  
    while (playlist_info.next != null) {
      let new_playlist_info = await fetch(playlist_info.next, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
      });
      playlist_info.push(new_playlist_info);
    }
  
    return await playlist_info.json();
}
  
export async function getFeats(songs) {
    let ids = songs.items.map( (items) => items.track.id );
    let i_max = Math.ceil(ids.length/100);
    let i_init = 0;
    const feats = {};
  
    while (i_init < i_max) {
      let curr_songs = ids.slice(100 * i_init, 100 * (i_init + 1));
      let new_feats = await fetch(`https://api.spotify.com/v1/audio-features?ids=${curr_songs}`, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
      });
      feats.push(new_feats);
      i_init++;
    };
  
    return await { ids, feats };
}