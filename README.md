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

##### [requirements.txt](requirements.txt)
Contains required packages.

##### [.gitignore](.gitignore)
Prevents uploading old cached code and personal authentication info.

### Instructions

0. (recommended but not required) Create an environment. Instructions for when using [pip](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) and [conda](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-with-commands)

1. In command line, run the command:
$ pip install -r requirements.txt $
As a note, this also installs packages for app.py, like spotipy, and some only needed for the walkthrough notebook, like seaborn.

2. In command line, run the command:
$ python app.py $
When prompted, paste in the link to the playlist you want to split.