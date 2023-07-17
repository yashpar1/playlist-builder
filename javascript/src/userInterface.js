import { getSongs } from './songInfo';
import { setupButton } from './button.js';

function returnPlaylists(playlists) {
  const names = playlists.items?.map( (items) => items.name);
  const ids = playlists.items?.map( (items) => items.id);
  return { names, ids };
}

export function showPlaylists(playlists, token) {
  let plays = returnPlaylists(playlists);
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

  ids?.forEach((playlist) => {
    getSongs(playlist, token).then(
      (songs) => {li.innerHTML += songs.items.map( (items) => items.track.name );
        ul.appendChild(li);
        // ul.appendChild(setupButton(songs));
        li = document.createElement('li');});
  });
}

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
}