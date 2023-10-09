import {returnPlaylists} from './userInterface.js';

export function Playlists(props) {
    const { playlists } = props;

    return (
	<ul>
	    {returnPlaylists(playlists).names?.map(name => {
		return (<li>{name}</li>);
	    })}
	</ul>
    );
}
