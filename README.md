# Spotify Playlist Builder

## Project Intro

<font size='2'>This project takes a Spotify playlist and splits it into smaller ones using some of the Audio Features for each track made publicly available by Spotify. It ignores labels like genre, instead grouping on features such as "tempo" or "energy" (more on that in [this notebook](exploratory_analysis_and_walkthrough.ipynb)). Plenty of tools to make playlists by genre already exist (Spotify even automatically makes some for you); grouping songs by audio features allows music from a variety of genres to be put into playlists that flow well despite containing diverse music. The motivation for the project was simple: I didn't want to manually decide which playlists to put 500 different songs on.  
  
The app is currently in developer mode, so access requires being manually added to a list of Authenticated Users. You could clone the repo and [set up your own Spotify app](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) for now, or [email me](yashwant.parmar@gmail.com) to be added to the list.</font>

## Organization

<font size='2'>The project was initially made as a Jupyter Notebook and python script, and the code needed for those is found in the folder [python](python). The description below talks about the files in that folder; a walkthrough of the rework in JavaScript will be added (and this ReadMe reorganized) once that section of the project is closer to complete.

## Instructions to Run

<font size='2'>

0. (recommended but not required) Create an environment. Instructions for when using [pip](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) and [conda](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-with-commands) hyperlinked.

1. In command line, run:  
```$ pip install -r requirements.txt```  
The file does not specify versions, and therefore defaults to the latest. You may need to update [pip](https://pip.pypa.io/en/stable/installation/#upgrading-pip) and [python](https://www.pythoncentral.io/how-to-update-python/) if installation fails. Update instructions hyperlinked.

2. In command line, run:  
```$ python app.py```  
When prompted, paste the link to the playlist you want to split. You'll also have to log in to Spotify (a browser should pop up automatically).

</font>

## Methods

<font size='2'>K-Means Clustering  
Spotipy  </font>

## Requirements
<font size='2'>[Python](https://www.python.org/downloads/ "Python")  
[Spotipy](https://spotipy.readthedocs.io/en/2.22.1/ "Spotipy")  
[Pandas](https://pandas.pydata.org/ "Pandas")  
[Scikit-Learn](https://scikit-learn.org/stable/ "scikit-learn")  
[seaborn](https://seaborn.pydata.org/ "seaborn")  </font>

## Files

#### [exploratory_analysis_and_walkthrough.ipynb](python/exploratory_analysis_and_walkthrough.ipynb)
<font size='2'>A walkthrough of how the clustering algorithm was created, including spotipy authorization, feature extraction, data cleaning, choosing features to cluster on, and playlist creation.</font>

#### [app.py](python/app.py)
<font size='2'>The file that takes a url to a Spotify playlist and splits it into smaller clustered playlists.</font>

#### [requirements.txt](python/requirements.txt)
<font size='2'>Contains packages required for both the notebook and app.py</font>

#### [.gitignore](.gitignore)
<font size='2'>Prevents uploading old cached code and personal authentication info.</font>

## Limitations and Future Improvements

<font size='2'>Spotify's API allows some audio information to be returned for 100 songs at a time. Some more granular data can only be accessed [one song at a time](https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis), however. For example, Spotify breaks song down into "sections," which "are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc." Many of the same features that are available for each track are available for each track's sections, but needing to make an API call for each song makes extracting and using this information incredibly slow. Easier access to this information would allow for better feature engineering. A variable denoting the complexity of a song, defined by how many sections and different keys or tempos there are within the song, could be helpful for clustering but is too slow to use as the API stands.  
  
Future improvements include testing with a wider variety of playlists to split in order to best decide which features to cluster on, and making a basic user interface with JavaScript. Once playlists become large enough the project has a tendency to simply split the playlists in half, which needs to be fixed.</font>