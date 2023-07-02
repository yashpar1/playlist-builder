import { getFeats } from "./songInfo";
import { accessToken } from "./main";

async function callPython(feats) {
    let groupedIds = await fetch('/clustering.py', {
        method: "POST", body: { feats }
    });

    return groupedIds;
}

function groupIds(clusters) {
    // to-do: update "reduce" to a function that works on arrays (or have clustering.py return differently formatted json)
    let groupByClusters = clusters.reduce((group, cluster) => {
        let { category } = cluster;
        group[category] = group[category] ?? [];
        group[category].push(cluster);
        return group
    }, {});
    let groupedIds = Object.values(groupByClusters).forEach(val.map( ({id}) => `spotify:track:${id}` ));

    return groupedIds;
}

export function createPlaylists(groupedIds) {
    groupedIds.forEach(createPlaylist);
}

async function createPlaylist(cluster) {
    let userId = profile.id;
    let playlist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }, body: { "name": "playlist_split"}
    });

    let playlistId = playlist.id;

    let iInit = 0;
    let iMax = Math.ceil(cluster.length/100);

    while (iInit < iMax) {
        let uris = cluster.slice(100 * iInit, 100 * (iInit + 1));
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "GET", headers: { Authorization: `Bearer ${accessToken}` }, body: { "uris": { uris }}
        });
        iInit++;
      };
};

export async function setupButton(element) {
    element.addEventListener('click', createPlaylists(groupIds(callPython(getFeats(element)))));
}