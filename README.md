# Spotify Playlist Builder

### Project Intro

#### This project takes a Spotify playlist and splits it into smaller ones. The rationale is simple: I was making playlists and knew there were songs that I wanted on a playlist, but I wasn't sure how to group them. I then realized that instead of individually making that decision for a few hundred different songs, I could just write a bit of code.

### Methods

#### K-Means Clustering  
#### Spotipy

### Requirements
#### [Python](https://www.python.org/downloads/ "Python")  
#### [Spotipy](https://spotipy.readthedocs.io/en/2.22.1/ "Spotipy")  
#### [Yellowbrick](https://www.scikit-yb.org/en/latest/ "Yellowbrick")  
#### [itertools](https://docs.python.org/3/library/itertools.html "itertools")  
#### [Pandas](https://pandas.pydata.org/ "Pandas")  
#### [Scikit-Learn](https://scikit-learn.org/stable/ "scikit-learn")  
#### [seaborn](https://seaborn.pydata.org/ "seaborn")  

### Files

#### [exploratory_analysis_and_walkthrough.ipynb](exploratory_analysis_and_walkthrough.ipynb)
##### A walkthrough of how the clustering algorithm was created, including spotipy authorization, feature extraction, data cleaning, choosing features to cluster on, and playlist creation.

#### [app.py](app.py)
##### The file that takes a url to a Spotify playlist and splits it into smaller clustered playlists.

#### [requirements.txt](requirements.txt)
##### Contains packages required for both the notebook and app.py

#### [.gitignore](.gitignore)
##### Prevents uploading old cached code and personal authentication info.

### Instructions

#### 0. (recommended but not required) Create an environment. Instructions for when using [pip](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) and [conda](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-with-commands)

#### 1. In command line, run the command:
#### ```$ pip install -r requirements.txt```

#### 2. In command line, run the command:
#### ```$ python app.py```
#### When prompted, paste in the link to the playlist you want to split.

### Limitations and Future Improvements

#### Spotify's API allows some audio information to be returned for 100 songs at a time. Some more granular data can only be accessed [one song at a time](https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis), however. For example, Spotify breaks song down into "sections," which "are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc." Many of the same features that are available for each track are available for each track's sections, but needing to make an API call for each song makes extracting and using this information incredibly slow. Easier access to this information would allow for better feature engineering. A variable denoting the complexity of a song, defined by how many sections and different keys or tempos there are within the song, could be helpful for clustering but is too slow to use as the API stands.