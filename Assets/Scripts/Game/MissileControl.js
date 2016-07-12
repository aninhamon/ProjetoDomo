#pragma strict

var fireForce = 60.0;

private var player : PlayerControl;
private var collided = false;
private var trailTime : float;

function Setup (playerControl : PlayerControl) {
	trailTime = GetComponent (TrailRenderer).time;	// Store original TrailRenderer time
	player = playerControl;	// Reference to player, so it can be accessed later
	MissileEnabled (false);
}

function MissileEnabled (enabled : boolean) {
	// When disabled, the renderer is turned off and the layer set to Ignore Raycast,
	// which is set to not collide with anything (in the physics settings collision matrix)
	// This is done instead of SetActive (false) in order to give the TrailRenderer time to dissipate
	GetComponent (Renderer).enabled = enabled;
	gameObject.layer = LayerMask.NameToLayer (enabled? "Missile" : "Ignore Raycast");
	GetComponent (Rigidbody).isKinematic = !enabled;	// Set to isKinematic when disabled
}

function Launch () {
	// Enable missile, play shoot sound, restore TrailRenderer time, and launch upwards
	MissileEnabled (true);
	GetComponent (AudioSource).Play();
	//GetComponent (TrailRenderer).time = trailTime;
    //GetComponent (Rigidbody).velocity = Vector3.up * fireForce;
	yield WaitForSeconds (0.05);
    collided = false;
	if (!collided) {
	    MissileEnabled (false);
	}
}

function OnCollisionEnter (other : Collision) : IEnumerator {
	if (collided) return;	// Ensure only one collision event
	Disable (other.gameObject.tag);
}

// The missile needs to be manually exploded from the bunkers, which use a trigger instead of a collider
function Disable (tag : String) {
	collided = true;
	//GetComponent (TrailRenderer).time = 0.1;
	//player.canFire = true;	// Player can fire again when missile is destroyed
	MissileEnabled (false);
	
	// If we hit something other than an invader, set off the dud explosion
	if (tag != "Invader") {
		ExplosionManager.use.Explode (ExplosionType.Dud, transform.position);
	}
	
	// Wait for TrailRenderer to settle down, then re-parent to player
	yield WaitForSeconds (1.0);
}