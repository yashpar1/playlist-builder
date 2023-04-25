# Spotify Playlist Builder

### Project Intro

This project takes a Spotify playlist and splits it into smaller ones. The rationale is simple: I was making playlists and knew there were songs that I wanted on a playlist, but I wasn't sure how to group them. I then realized that instead of individually making that decision for a few hundred different songs, I could just write a bit of code.

### Methods

K-Means Clustering
Spotipy

### Requirements
[Python](https://www.python.org/downloads/ "Python")  
[Spotipy](https://spotipy.readthedocs.io/en/2.22.1/ "Spotipy")  
[Yellowbrick](https://www.scikit-yb.org/en/latest/ "Yellowbrick")  
[itertools](https://docs.python.org/3/library/itertools.html "itertools")  
[Pandas](https://pandas.pydata.org/ "Pandas")  
[Scikit-Learn](https://scikit-learn.org/stable/ "scikit-learn")  
[seaborn](https://seaborn.pydata.org/ "seaborn")  

### Files

##### [exploratory_analysis_and_walkthrough.ipynb](exploratory_analysis_and_walkthrough.ipynb)
This file contains a walkthrough of how the clustering algorithm was created, including spotipy authorization, feature extraction, data cleaning, choosing features to cluster on, and playlist creation.

##### [app.py](app.py)
The file to run in order to create playlists.
