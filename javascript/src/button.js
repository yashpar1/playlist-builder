import { getFeats } from "./songInfo";
// import express from 'express';
let url = 'http://localhost:3000/cluster';

async function callPython(ids, feats) {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({'ids': ids, 'feats': feats})
    });
    return response.json();

    // let groupedIds = $.ajax({
    //     type: "POST",
    //     url: "http://localhost:3000/cluster",
    //     // url: "public/clustering.py",
    //     data: { ids: JSON.stringify(ids), feats: JSON.stringify(feats) }
    // });
    // console.log(groupedIds);

    // return groupedIds;
}

function groupIds(clusters) {
    console.log(clusters);
    let groupByClusters = clusters.reduce( (group, cluster) => {
        let { category } = cluster;
        group[category] = group[category] ?? [];
        group[category].push(cluster);
        return group;
    }, {});
    let groupedIds = Object.values(groupByClusters).forEach(val.map( ({id}) => `spotify:track:${id}` ));

    return groupedIds;
}

export function createPlaylists(groupedIds) {
    groupedIds.forEach(createPlaylist);
}

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
    element.addEventListener('click', createPlaylists(callPython(groupIds(getFeats(element, token)))))
};