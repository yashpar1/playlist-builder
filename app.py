import spotipy, pandas as pd, json, numpy as np
from spotipy.oauth2 import SpotifyOAuth
from sklearn import preprocessing as pre
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_samples, silhouette_score
from yellowbrick.cluster import KElbowVisualizer, SilhouetteVisualizer
import matplotlib.pyplot as plt
import seaborn as sns
from itertools import combinations, permutations
import sys

if not sys.warnoptions:
    import warnings
    warnings.simplefilter("ignore")

scope = 'playlist-modify-public playlist-modify-private'
red_url = 'http://localhost:8080'
playlist = input('Paste the url to your Spotify playlist here: \n')
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(redirect_uri=red_url,scope=scope))
user = sp.me()['id']

def feature_extraction(playlist):
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
    
    df_feats = pd.DataFrame(song_feats)[['id','danceability', 'mode', 'instrumentalness']]

    return df_feats

def feature_norming(dataframe_features):
    to_norm = dataframe_features[['danceability', 'instrumentalness']].values
    scaler = pre.MinMaxScaler()
    normed = scaler.fit_transform(to_norm)
    df_feats = dataframe_features.drop(['danceability', 'instrumentalness'], axis=1).join(pd.DataFrame(normed, columns=['danceability', 'instrumentalness']))
    return df_feats

def playlist_creation(dataframe_features):
    df_clustering = dataframe_features.set_index('id')
    n_clusters = [2, 3, 4, 5, 6]
    model = KElbowVisualizer(KMeans(), k=(min(n_clusters), max(n_clusters)), metric='silhouette', timings=False)
    model.fit(df_clustering.values)
    num_clusts = model.elbow_value_
    mod = KMeans(n_clusters=num_clusts).fit(df_clustering.values)
    clusters = {'cluster': mod.labels_}
    df_clustered = dataframe_features.join(pd.DataFrame(clusters))

    for i in range(num_clusts):
        songs = list(df_clustered['id'][df_clustered['cluster'] == i])
        name = f'created_playlist_{i+1}'
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