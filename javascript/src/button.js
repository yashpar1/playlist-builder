import { getFeats } from "./songInfo";
import { token } from "./main";

async function callPython(ids, feats) {
    let groupedIds = $.ajax({
        type: "POST",
        url: "./clustering.py",
        data: { ids: JSON.stringify(ids), feats: JSON.stringify(feats) }
    });

    return groupedIds;
}

function groupIds(clusters) {
    let groupByClusters = clusters.reduce( (group, cluster) => {
        let { category } = cluster;
        group[category] = group[category] ?? [];
        group[category].push(cluster);
        return group;
    }, {});
    let groupedIds = Object.values(groupByClusters).forEach(val.map( ({id}) => `spotify:track:${id}` ));

    console.log(groupedIds);
    return groupedIds;
}

export function createPlaylists(groupedIds) {
    groupedIds.forEach(createPlaylist);
}

async function createPlaylist(cluster) {
    let userId = profile.id;
    let playlist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "GET", headers: { Authorization: `Bearer ${ token }` }, body: { "name": "playlist_split"}
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

export async function setupButton(element) {
    element.addEventListener('click', createPlaylists(groupIds(callPython(getFeats(element)))));
}