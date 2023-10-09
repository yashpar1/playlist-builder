export function ProfileData(props) {
    const { profile } = props;
    const {
	id,
	email,
	uri,
	href,
	display_name,
	images,
	external_urls,
    } = profile;

    const imgUrl = images[0]
	  ? images[0].url
	  : undefined;
    const img = () => {
	return images[0]
	    ? <img src={imgUrl} width="200" height="200" />
	    : undefined;
    };
    
    return (
	<section id="profile">
	    <h2>Logged in as <span id="displayName">{display_name}</span></h2>
	    <span id="avatar">{img()}</span>
	    <ul>
		<li>User ID: <span id="id">{id}</span></li>
		<li>Email: <span id="email">{email}</span></li>
		<li>Spotify URI: <a id="uri" href={external_urls.spotify}>{uri}</a></li>
		<li>Link: <a id="url" href={href}>{href}</a></li>
		<li>Profile Image: <span id="imgUrl">{imgUrl}</span></li>
	    </ul>
	</section>
    );
}
