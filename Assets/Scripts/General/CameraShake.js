var startingShakeDistance = 1.0;
var decreasePercentage = .5;
var shakeSpeed = 50.0;
var numberOfShakes = 3;

function Shake () : IEnumerator {
	var originalPosition = transform.position.x;
	var shakeCounter = numberOfShakes;
	var shakeDistance = startingShakeDistance;
	var timer = 0.0;
	
	while (shakeCounter > 0) {
		transform.position.x = originalPosition + Mathf.Sin (timer) * shakeDistance;
		timer += Time.deltaTime * shakeSpeed;
		// See if we've gone through an entire sine wave cycle, reset distance timer if so and do less distance next cycle
		if (timer > Mathf.PI * 2.0) {
			shakeDistance *= decreasePercentage;
			timer -= Mathf.PI * 2.0;
			shakeCounter--;
		}
		yield;
	}
	transform.position.x = originalPosition;
}