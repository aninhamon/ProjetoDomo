// Rotates an object about an axis
#pragma strict

var rotateSpeed = 15.0;
var rotateAxis = Vector3(0.0, 0.0, 1.0);

function Update () {
	transform.Rotate (rotateAxis * rotateSpeed * Time.deltaTime);
}