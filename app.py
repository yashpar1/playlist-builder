import spotipy, pandas as pd
from spotipy.oauth2 import SpotifyPKCE
from sklearn import preprocessing as pre
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import sys
from itertools import combinations

if not sys.warnoptions:
    import warnings
    warnings.simplefilter("ignore")

scope = 'playlist-modify-public playlist-modify-private'
red_url = 'http://localhost:8080'
client_id = '3d05de7a35df4db0a064b4e40d9c6638'
playlist = input('Paste the url to your Spotify playlist here: \n')
sp = spotipy.Spotify(auth_manager=SpotifyPKCE(client_id=client_id, redirect_uri=red_url, scope=scope))
user = sp.me()['id']

def feature_extraction(playlist):
    """
    A function to extract relevant song features from the inputted playlist.
    """

    offset = 0
    song_ids = []
    while True:
        songs = sp.playlist_tracks(playlist_id=playlist, offset=offset, fields='items.track.id', limit=100)['items']
        if len(songs) == 0:
            break
        song_ids += [d['track']['id'] for d in songs]
        offset += len(songs)

    offset = 0
    limit = 50
    song_feats = []
    while offset < len(song_ids):
        song_feats += sp.audio_features(tracks=song_ids[offset: offset + limit])
        offset += limit
    
    df_feats = pd.DataFrame(song_feats)[['id', 'energy', 'tempo', 'danceability', 'valence']]
    return df_feats

def feature_norming(dataframe_features):
    """
    A function to norm the extracted audio features
    """

    to_norm = dataframe_features[['energy', 'tempo', 'danceability', 'valence']].values
    scaler = pre.MinMaxScaler()
    normed = scaler.fit_transform(to_norm)
    df_feats = dataframe_features.drop(['energy', 'tempo', 'danceability', 'valence'], axis=1).join(pd.DataFrame(normed, columns=['energy', 'tempo', 'danceability', 'valence']))
    return df_feats

def playlist_creation(dataframe_features):
    """
    Clusters the songs in the playlist and creates new playlists from those clusters. Tests 6 different feature combinations.
    """

    df_clustering = dataframe_features.set_index('id')
    play_name = sp.playlist(playlist_id=playlist, fields='name')['name']

    n_clusters = [2, 3, 4, 5, 6]
    cols = list(df_clustering)
    score, value = [], []
    combos = list(combinations(cols, 2))
    for combo in combos:
        subset = df_clustering[list(combo)]
        scores = []
        for n in n_clusters:
            model = KMeans(n_clusters=n)
            clusters = model.fit_predict(subset)
            scores.append(silhouette_score(subset, clusters))
        score.append(max(scores))
        value.append(scores.index(max(scores)) + min(n_clusters))

    performance = {'max_score': score, 'clusters': value}
    df_combos = pd.DataFrame(combos, columns=['feat_1', 'feat_2']).join(pd.DataFrame(performance))
    df_combos['total'] = df_combos.apply(lambda combo: combo['max_score'] * combo['clusters'], axis=1)

    feat_1 = df_combos[df_combos['total']==df_combos['total'].max()]['feat_1'].values[0]
    feat_2 = df_combos[df_combos['total']==df_combos['total'].max()]['feat_2'].values[0]
    num_clusts = df_combos[df_combos['total']==df_combos['total'].max()]['clusters'].values[0]
    print(f'Creating {num_clusts} playlists with clusters based on {feat_1} and {feat_2}')

    df_to_cluster = dataframe_features[['id', feat_1, feat_2]]
    model = KMeans(n_clusters=num_clusts).fit(df_to_cluster[[feat_1, feat_2]].values)
    clusters = {'cluster': model.labels_}
    df_clustered = df_to_cluster.join(pd.DataFrame(clusters))

    # Creates a playlist for each cluster (if no playlist with the same name exists)
    for i in range(num_clusts):
        songs = list(df_clustered['id'][df_clustered['cluster'] == i])
        name = f'{play_name}_split_{i+1}'
        current_playlists = []
        offset = 0
        while True:
            playlists = sp.current_user_playlists(limit=50, offset=offset)['items']
            if len(playlists) == 0:
                break
            current_playlists += [d['name'] for d in playlists]
            offset += len(playlists)
        if name in current_playlists:
            continue
        sp.user_playlist_create(user=user, name=name)
        new = sp.current_user_playlists(limit=1)['items'][0]['uri']
        if len(songs) > 100:
            j = 0
            while j < (len(songs)//100 + 1):
                sub_songs = songs[100*j:100*(1+j)]
                sp.user_playlist_add_tracks(user=user, playlist_id=new, tracks=sub_songs)
                j += 1
            sp.user_playlist_add_tracks(user=user, playlist_id=new, tracks=songs[-(len(songs)%100):])
        else:
            sp.user_playlist_add_tracks(user=user, playlist_id=new, tracks=songs)

playlist_creation(feature_norming(feature_extraction(playlist)))