import { getFeats } from "./songInfo";
import { accessToken, fetchPlaylists } from "./main";

function callPython(feats) {
    $.ajax({
        type: "POST",
        url: "/clustering.py",
        data: { param: feats },
        success: groupIds
    });
}

function groupIds(clusters) {
    let groupByClusters = clusters.reduce((group, cluster) => {
        let { category } = cluster;
        group[category] = group[category] ?? [];
        group[category].push(cluster);
        return group
    }, {});
    let groupedIds = groupByClusters.forEach(cluster.map( ({id}) => id ));
    groupedIds.forEach( (element, index) => { groupedIds[index] = 'spotify:track:' + element});

    return groupedIds;
}

export function createPlaylists(groupedIds) {
    groupedIds.forEach(createPlaylist);
}

async function createPlaylist(cluster) {
    // to-do: get user_id from profile
    let playlist = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }, body: { "name": "playlist_split"}
    });

    let playlistId = playlist.id;

    let i_init = 0;
    let i_max = Math.ceil(cluster.length/100);

    while (i_init < i_max) {
        let uris = cluster.slice(100 * i_init, 100 * (i_init + 1));
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "GET", headers: { Authorization: `Bearer ${accessToken}` }, body: { "uris": { uris }}
        });
        i_init++;
      };
};

export async function createButton(element) {
    element.addEventListener('click', createPlaylists(callPython(getFeats(element))))
}