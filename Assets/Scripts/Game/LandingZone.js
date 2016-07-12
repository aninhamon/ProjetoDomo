// Game over if any invader hits this trigger
#pragma strict

private var landed = false;

function OnTriggerEnter (other : Collider) {
	if (landed) return;
	
	if (other.CompareTag ("Invader")) {
		landed = true;
		InvaderManager.use.Landed();
	}
}