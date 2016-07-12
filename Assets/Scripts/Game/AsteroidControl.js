// This script controls the behavior of the asteroids in the background
// The asteroids and star background are drawn by a separate camera which doesn't move, so they stay in place when the main camera moves
// In the physics settings, the background layer is set to not interact with the default layer
#pragma strict

var asteroids : Transform[];
var asteroidMeshes : Mesh[];
var minXForce = 40.0;
var maxXForce = 130.0;
var maxYAngle = 25.0;
var maxTorque = 0.2;
var minScale = 2.0;
var maxScale = 11.0;
var minWait = 4.0;
var maxWait = 12.0;

private var inUse : boolean[];

function Start () : IEnumerator {
	inUse = new boolean[asteroids.Length];
	var xBound = GetComponent (BoxCollider).size.x / 2;
	var yBound = GetComponent (BoxCollider).size.y / 2;
	var firstLoop = true;
	
	// Keep spawning asteroids forever
	while (true) {
		if (firstLoop) {	// Have the first asteroid start immediately rather than waiting a random interval
			firstLoop = false;
			var index = 0;
		}
		else {				// Otherwise wait a random time and pick a random asteroid
			yield WaitForSeconds (Random.Range (minWait, maxWait));
			index = Random.Range (0, asteroids.Length);
		}
		
		// If the picked asteroid is in use, pick another one and wait a frame, and keep doing that until getting an unused asteroid
		while (inUse[index]) {
			index = Random.Range (0, asteroids.Length);
			yield;
		}
		
		// Activate picked asteroid and set the appropriate inUse flag in the array
		asteroids[index].gameObject.SetActive (true);
		inUse[index] = true;
		
		var dir = (Random.value < 0.5)? -1 : 1;	// Either left or right
		// Pick a random position at the bounds of the trigger box
		asteroids[index].position = Vector3(xBound * dir,
											Random.Range (transform.position.y - yBound, transform.position.y + yBound),
											asteroids[index].position.z);
		// Pick a random asteroid mesh
		asteroids[index].GetComponent (MeshFilter).mesh = asteroidMeshes[Random.Range(0, asteroidMeshes.Length)];
		
		// Pick a random size
		var scale = Random.Range (minScale, maxScale);
		asteroids[index].localScale = Vector3(scale, scale, scale);
		
		// Pick a random force and torque
		var xForce = Random.Range (minXForce, maxXForce) * -dir;
		var yForce = Random.Range (-maxYAngle, maxYAngle);
		asteroids[index].GetComponent (Rigidbody).AddForce (xForce, yForce, 0.0, ForceMode.VelocityChange);
		asteroids[index].GetComponent (Rigidbody).AddTorque (RandomTorque(), RandomTorque(), RandomTorque(), ForceMode.VelocityChange);
		
		// Set the index number on the asteroid, so it can be referred to elsewhere
		asteroids[index].GetComponent (AsteroidNumber).indexNumber = index;
	}
}

function RandomTorque () : float {
	return Random.Range (-maxTorque, maxTorque);
}

// If an asteroid leaves the trigger box, deactivate it and mark it as unused so it can be picked again
function OnTriggerExit (asteroid : Collider) {
	var index = asteroid.GetComponent (AsteroidNumber).indexNumber;
	asteroids[index].GetComponent (Rigidbody).velocity = Vector3.zero;
	asteroids[index].gameObject.SetActive (false);
	inUse[index] = false;
}