# Spotify Playlist Builder

## Project Intro

<font size='2'>This project takes a Spotify playlist and splits it into smaller ones using some of the Audio Features for each track made publicly available by Spotify. It ignores labels like genre, instead grouping on features such as "tempo" or "energy" (more on that in [this notebook](python/exploratory_analysis_and_walkthrough.ipynb)). Plenty of tools to make playlists by genre already exist (Spotify even automatically makes some for you); grouping songs by audio features allows music from a variety of genres to be put into playlists that flow well despite containing diverse music. The motivation for the project was simple: I didn't want to manually decide which playlists to put 500 different songs on.  
  
The app is currently in developer mode, so access requires being manually added to a list of Authenticated Users. You could clone the repo and [set up your own Spotify app](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) for now, or [email me](yashwant.parmar@gmail.com) to be added to the list.</font>

## Organization
The project was initially done in python. The folder [python](python) contains all the code and write-ups associated, including a notebook with a description of how the clustering algorithm was created and why certain decisions were made and a python script to run the project. A rework in JavaScript is underway in order to create a webpage from which users can simply select the playlist they want to split instead of having to install and run the project locally.

## Limitations and Future Improvements

<font size='2'>Spotify's API allows some audio information to be returned for 100 songs at a time. Some more granular data can only be accessed [one song at a time](https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis), however. For example, Spotify breaks song down into "sections," which "are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc." Many of the same features that are available for each track are available for each track's sections, but needing to make an API call for each song makes extracting and using this information incredibly slow. Easier access to this information would allow for better feature engineering. A variable denoting the complexity of a song, defined by how many sections and different keys or tempos there are within the song, could be helpful for clustering but is too slow to use as the API stands.  
  
Future improvements include testing with a wider variety of playlists to split in order to best decide which features to cluster on, and making a basic user interface with JavaScript. Once playlists become large enough the project has a tendency to simply split the playlists in half, which needs to be fixed.</font>