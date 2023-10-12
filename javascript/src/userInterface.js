import { returnCompiledSongs } from './songInfo';
import { setupButton } from './button.js';

export function returnPlaylists(playlists) {
  const names = playlists.items?.map( (items) => items.name );
  const ids = playlists.items?.map( (items) => items.id );
  return { names, ids };
};

// to-do: update so tracks can output songs/ids/artists
function returnSongs(tracks, opts) {
  let songs = tracks.map( (tracks) => tracks.track.name)
  let ids = tracks.map( (tracks) => tracks.id);
  let artists = tracks?.map( (tracks) => tracks.artists?.map( (artists) => artists.name));
  let result = { songs, ids, artists };
  let {onComplete} = opts;
  onComplete(result);
};

export function showPlaylists(playlists, token) {
  let plays = returnPlaylists(playlists);
  console.log(plays);
  let tracks = returnCompiledSongs(plays.ids, token);
  console.log(tracks);
  let sorted = [];
  // the issue now is that tracks is getting things pushed to it asynchronously, so I can't access things in it
  // i.e. liked songs being 6555 songs to get through before it's done returning things
  // solution might be to wrap the expected return in a Promise, and then continue on with the ".then" stuff
  // tracks.forEach(tracks => returnSongs(tracks, {onComplete: (info) => { sorted.push(info) }}));
  // console.log(sorted);

  let ul = document.createElement('ul');
  let li = document.createElement('li');

  document.getElementById('profile').appendChild(ul);

  plays.names?.forEach((playlist) => {
    li.innerHTML += playlist;
    ul.appendChild(li);
    li = document.createElement('li');
  });

  // tracks.forEach((tracks) => {
  //   li.innerHTML += tracks;
  //   ul.appendChild(li);
  //   li = document.createElement('li');
  // });

  // songs?.forEach((playlist) => {

  // });

// to-do: render songs and buttons using forEach

//     .then(
//       (songs) => {li.innerHTML += songs.items.map( (items) => items.track.name );
//         ul.appendChild(li);
//         ul.appendChild(setupButton(li.items.map( (items) => items.track.id ), token));
//         li = document.createElement('li');});
//   });
};
