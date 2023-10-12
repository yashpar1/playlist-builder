import { getFeats } from "./songInfo";
let url = new URL('http://172.27.22.32:3000/cluster');

async function callPython(ids, feats) {
    url.search = new URLSearchParams({
        ids:JSON.stringify(ids),
        feats:JSON.stringify(feats)
    })
    
    const response = await fetch(url, {
        method: "GET"
    });
    return response.json();
};

export function groupIds(clusters) {
    console.log(clusters);
    let groupByClusters = clusters.reduce( (group, cluster) => {
        let { category } = cluster;
        group[category] = group[category] ?? [];
        group[category].push(cluster);
        return group;
    }, {});
    let groupedIds = Object.values(groupByClusters).forEach(val.map( ({id}) => `spotify:track:${id}` ));

    return groupedIds;
};

export function createPlaylists(groupedIds) {
    groupedIds.forEach(createPlaylist);
};

// this might need to be split into a function that gets playlist ID and then a function that adds songs (can probably be same loop)
// will be easier to tell once we get the initial looped api call set up
export async function createPlaylist(cluster, token) {
    let userId = profile.id;
    let playlist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }, body: { "name": "playlist_split"}
    });

    let playlistId = playlist.id;

    let iInit = 0;
    let iMax = Math.ceil(cluster.length/100);

    while (iInit < iMax) {
        let uris = cluster.slice(100 * iInit, 100 * (iInit + 1));
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "GET", headers: { Authorization: `Bearer ${token}` }, body: { "uris": { uris }}
        });
        iInit++;
      };
};

export async function setupButton(element, token) {
    element.addEventListener('click', createPlaylists(groupIds(callPython(getFeats(element, token)))))
};