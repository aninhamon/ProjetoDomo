#pragma strict

private var idX : int;
private var idY : int;
private var idType : int;

// Set x and y coords in the invaders array, and the type, so this info can be referenced when needed
function SetID (x : int, y : int, type : int) {
	idX = x;
	idY = y;
	idType = type;
}

// Reset defaults, since these can be changed over the course of the level
function Setup () {
	gameObject.layer = LayerMask.NameToLayer ("Invader");
	transform.rotation = Quaternion.identity;
	GetComponent (Rigidbody).constraints = RigidbodyConstraints.FreezeAll;	// Prevent missile hits from knocking the invader around
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("Boundary")) {
		InvaderManager.use.ReverseMovement();
	}
}

function OnCollisionEnter (other : Collision) {
	// If we were hit by a missile, remove ourselves
	if (other.gameObject.CompareTag ("Missile")) {
		// Sometimes we randomly fall out of the sky instead of being exploded, as long there are no other falling invaders currently
		var isFalling = (!InvaderManager.use.invaderFalling && Random.value < InvaderManager.use.dudChance);
		// Use either dud or invader explosions depending on whether we're falling or not
		ExplosionManager.use.Explode (isFalling? ExplosionType.Dud : ExplosionType.Invader, transform.position);
		InvaderManager.use.RemoveInvader (idX, idY, idType, isFalling);
	}
	// Otherwise we hit the ground
	else {
		// Do nothing if we landed normally
		if (gameObject.layer == LayerMask.NameToLayer ("Invader")) {
			return;
		}
		// Go boom if we're a falling invader (which uses a different layer)
		ExplosionManager.use.Explode (ExplosionType.Invader, transform.position);
		InvaderManager.use.HitGround (idX, idY, idType);
	}
}