#pragma strict

var ufo : Transform;
var minWaitTime = 20.0;
var maxWaitTime = 30.0;
var startPos = 60.0;
var speed = 10.0;

private var startVolume : float;
private var startPitch : float;

function Awake () {
	// Since these are changed later, we want to store the original values
	startVolume = ufo.GetComponent (AudioSource).volume;
	startPitch = ufo.GetComponent (AudioSource).pitch;
}

function UFOLoop () : IEnumerator {
	while (true) {
		yield Wait();
		StartUFO();
	}
}

function Wait () : IEnumerator {
	var timer = Random.Range (minWaitTime, maxWaitTime);
	// The timer only counts down while the level is in progress
	while (timer >= 0.0) {
		if (GameManager.use.levelInProgress) {
			timer -= Time.deltaTime;
		}
		yield;
	}
}

function StartUFO () : IEnumerator {
	ufo.gameObject.SetActive (true);
	ufo.GetComponent (AudioSource).volume = startVolume;
	ufo.GetComponent (AudioSource).pitch = startPitch;
	ufo.GetComponent (Renderer).enabled = true;
	ufo.gameObject.layer = LayerMask.NameToLayer ("Invader");
	ufo.GetComponent (UFOControl).exploded = false;
	// Randomly choose the left or right side
	var dir = (Random.value < 0.5)? 1 : -1;
	ufo.position.x = startPos * -dir;
	
	// Keep looping while the UFO is still alive and inside the playfield
	// Also check the didSwitchover boolean in GameManager, to cancel the UFO during level transitions, if necessary
	// (We don't want to cancel it immediately, since it's classier for it to disappear behind the camera first)
	while (ufo.gameObject.activeInHierarchy && (ufo.position.x >= -startPos && ufo.position.x <= startPos) && !GameManager.use.didSwitchover) {
		// Move either left or right as long as it's not exploded
		if (!ufo.GetComponent (UFOControl).exploded) {
			ufo.Translate (Vector3.right * dir * speed * Time.deltaTime);
		}
		yield;
	}
	ufo.gameObject.SetActive (false);
}