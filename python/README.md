# Python Walkthrough

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

#### [exploratory_analysis_and_walkthrough.ipynb](exploratory_analysis_and_walkthrough.ipynb)
<font size='2'>A walkthrough of how the clustering algorithm was created, including spotipy authorization, feature extraction, data cleaning, choosing features to cluster on, and playlist creation.</font>

#### [app.py](app.py)
<font size='2'>The file that takes a url to a Spotify playlist and splits it into smaller clustered playlists.</font>

#### [requirements.txt](requirements.txt)
<font size='2'>Contains packages required for both the notebook and app.py</font>