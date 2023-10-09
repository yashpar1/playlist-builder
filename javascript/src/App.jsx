import {h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {
    useAccessToken,
    useProfile,
    usePlaylists,
    redirectToAuthCodeFlow,
} from './main.js';
import { ProfileData } from './ProfileData.jsx';
import { Playlists } from './Playlists.jsx';

export function App(props) {
    const clientId = '3d05de7a35df4db0a064b4e40d9c6638';
    const params = new URLSearchParams(window.location.search);
    const [code, setCode] = useState(params.get('code'));
    const accessToken = useAccessToken(clientId, code);
    const profile = useProfile(accessToken);
    const playlists = usePlaylists(accessToken);

    const onclick = () => {
	redirectToAuthCodeFlow(clientId);
    };

    return !code
        ? <button onclick={onclick}>Start</button>
        : (
	<div>
	    <h1>Display your Spotify profile data</h1>
	    {
		profile
		    ? <ProfileData profile={profile} />
		    : <span>Loading...</span>
	    }
	    {
		playlists
		    ? <Playlists playlists={playlists} />
		    : undefined
	    }
	</div>
    );
}
