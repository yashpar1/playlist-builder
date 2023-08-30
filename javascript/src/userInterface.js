import { getSongs } from './songInfo';
import { setupButton } from './button.js';

function returnPlaylists(playlists) {
  const names = playlists.items?.map( (items) => items.name );
  const ids = playlists.items?.map( (items) => items.id );
  return { names, ids };
};

function returnSongs(tracks) {
  const songs = tracks?.map( (tracks) => tracks.items?.map( (items) => items.track.name));
  const ids = tracks?.map( (tracks) => tracks.items?.map( (items) => items.track.id));
  const artists = tracks?.map( (tracks) => tracks.items?.map( (items) => items.track.artists?.map( (artists) => artists.name)));
  return { songs, ids, artists };
};

export function showPlaylists(playlists, token) {
  let plays = returnPlaylists(playlists);
  let tracks = Promise.all(plays.ids?.map( (playlist) => getSongs(playlist, token) )).then(returnSongs);
  let songs = tracks.then( (tracks) => {return tracks.songs} );
  let ids = tracks.then( (tracks) => {return tracks.ids} );
  let artists = tracks.then( (tracks) => {return tracks.artists} );

  let ul = document.createElement('ul');
  let li = document.createElement('li');

  document.getElementById('profile').appendChild(ul);

  plays.names?.forEach((playlist) => {
    li.innerHTML += playlist;
    ul.appendChild(li);
    li = document.createElement('li');
  });

// to-do: render songs and buttons using forEach
  // songs.forEach((songs) => {console.log(songs)});

//     .then(
//       (songs) => {li.innerHTML += songs.items.map( (items) => items.track.name );
//         ul.appendChild(li);
//         ul.appendChild(setupButton(li.items.map( (items) => items.track.id ), token));
//         li = document.createElement('li');});
//   });
};

export function populateUI(profile, playlists, token) {
  document.getElementById("displayName").innerText = profile.display_name;
  if (profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar").appendChild(profileImage);
    document.getElementById("imgUrl").innerText = profile.images[0].url;
  };

  document.getElementById("id").innerText = profile.id;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("uri").innerText = profile.uri;
  document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);
  document.getElementById("url").innerText = profile.href;
  showPlaylists(playlists, token);
};