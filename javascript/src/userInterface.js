import { returnPlaylists } from "./main";
import { getSongs } from './songInfo';

export function showPlaylists(playlists) {
    const plays = returnPlaylists(playlists);
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