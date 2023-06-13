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
red_uri = 'http://localhost:8080'
client_id = '3d05de7a35df4db0a064b4e40d9c6638'
sp = spotipy.Spotify(auth_manager=SpotifyPKCE(client_id=client_id, redirect_uri=red_uri, scope=scope))
user = sp.me()['id']
features = ['energy', 'tempo', 'danceability', 'valence']

def feature_extraction(ids, feats):
    """
    Creates Pandas DataFrame of song ids and features, norms features
    """
    
    df_feats = pd.DataFrame(ids).join(pd.DataFrame(feats)[[features]])
    to_norm = df_feats[features].values
    scaler = pre.MinMaxScaler()
    normed = scaler.fit_transform(to_norm)
    df_feats = df_feats.drop(features, axis=1).join(pd.DataFrame(normed, columns=features))
    return df_feats

def playlist_creation(dataframe_features):
    """
    Clusters the songs in the playlist and creates new playlists from those clusters. Tests 6 different feature combinations.
    """

    df_clustering = dataframe_features.set_index('id')

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
    best = df_combos[df_combos['total']==df_combos['total'].max()]

    feat_1 = best['feat_1'].values[0]
    feat_2 = best['feat_2'].values[0]
    num_clusts = best['clusters'].values[0]

    df_to_cluster = dataframe_features[['id', feat_1, feat_2]]
    model = KMeans(n_clusters=num_clusts).fit(df_to_cluster[[feat_1, feat_2]].values)
    clusters = {'cluster': model.labels_}
    df_clustered = df_to_cluster.join(pd.DataFrame(clusters))
    return df_clustered

def to_javascript(df_clustered):
    pass