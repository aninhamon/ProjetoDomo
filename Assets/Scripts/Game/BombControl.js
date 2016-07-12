#pragma strict

function OnCollisionEnter () {
	Disable ("");
}

// The bomb needs to be manually exploded from the bunkers, which use a trigger instead of a collider
function Disable (tag : String) {
	ExplosionManager.use.Explode (ExplosionType.Bomb, transform.position);
	gameObject.SetActive (false);
}