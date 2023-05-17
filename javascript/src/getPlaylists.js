// import {accessToken} from './main.js';
const accessToken = require('./main.js');

async function fetchPlaylists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
  
    return await result.json();
}

function returnPlaylists(playlists) {
    const names = playlists.items.map(getNames);
    return names;
}
  
function getNames(playlist) {
    return playlist.name;
}

// let items = returnPlaylists(fetchPlaylists(accessToken));

// // let list = document.getElementById("myList");

// // data.forEach((item) => {
// //     let li = document.createElement("li");
// //     li.innerText = item;
// //     list.appendChild(li);
// // });

// // Make the list
// let ul = document.createElement('ul');

// // Make the list item
// let li = document.createElement('li');

// document.querySelector('#myItemList').appendChild(ul);

// items.forEach((item) => {
//     // Add the item text
//     li.innerHTML += item;

//     // Add li to the ul
//     ul.appendChild(li);

//     // Reset the list item
//     li = document.createElement('li');
// });