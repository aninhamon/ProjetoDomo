// Moves the coin to a specified orientation to make dropping into the coin slot easier
#pragma strict

var targetRotation = Vector3(0, 0, 90);
var targetPosition = Vector3(14.21, 3.0, -2.31);
private var triggered = false;

function OnTriggerEnter (coin : Collider) : IEnumerator {
	// Make sure this function can only run once, and only if the coin is not being picked up
	if (triggered || coin.GetComponent (CoinControl).pickingUp) return;
	
	triggered = true;
	var fromRotation = coin.transform.rotation;
	var toRotation = Quaternion.Euler (targetRotation);
	var startPos = coin.transform.position;
	// Transform coin to desired position/rotation over time, as long as the coin is above the target height
	while (transform.position.y > targetPosition.y) {
		var t = Mathf.InverseLerp (startPos.y, targetPosition.y, coin.transform.position.y);
		coin.transform.rotation = Quaternion.Slerp (fromRotation, toRotation, t);
		coin.transform.position.x = Mathf.Lerp (startPos.x, targetPosition.x, t);
		coin.transform.position.z = Mathf.Lerp (startPos.z, targetPosition.z, t);

		yield;
	}
}