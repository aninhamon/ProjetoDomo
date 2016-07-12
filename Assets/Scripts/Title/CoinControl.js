#pragma strict

var cursor : CursorControl;
var coinSound : AudioClip;
var pickupSound : AudioClip;
var pickupSpeed = 3.5;
var pickupTargetRotation = Vector3(0, 0, 82);
var pickupTargetHeight1 = 3.5;
var pickupTargetHeight2 = 4.2;

private var highlighted = false;
private var manualControl = false;
private var m_pickingUp = false;
function get pickingUp () : boolean {return m_pickingUp;}

function OnCollisionEnter () {
	GetComponent (AudioSource).clip = coinSound;
	GetComponent (AudioSource).Play();
}

function OnMouseOver () {
	cursor.CursorHighlight (true);
}

function OnMouseExit () {
	cursor.CursorHighlight (false);
}

function OnMouseDown () {
	GetComponent (AudioSource).clip = pickupSound;
	GetComponent (AudioSource).Play();
	cursor.SetHandClosed (true);
	StopAllCoroutines();
	Pickup();
}

function OnMouseUp () {
	DropCoin();
}

function DropCoin () {
	cursor.SetHandClosed (false);
	StopAllCoroutines();	// Interrupt the pickup routine if needed, since it might be running if the user clicks fast
	GetComponent (Rigidbody).isKinematic = false;
	GetComponent (Rigidbody).WakeUp();
	manualControl = false;
}

function Pickup () : IEnumerator {
	GetComponent (Rigidbody).isKinematic = true;
	m_pickingUp = true;	// So other scripts can know if we're currently doing the pickup routine
	
	// Raise coin up to targetHeight1
	while (transform.position.y < pickupTargetHeight1) {
		transform.position.y += Time.deltaTime * pickupSpeed;
	}
	
	// Raise coin up to targetHeight2, and rotate to target rotation, while moving to the cursor position in world space
	var fromRotation = transform.rotation;
	var toRotation = Quaternion.Euler (pickupTargetRotation);
	var startPos = transform.position;
	while (transform.position.y < pickupTargetHeight2) {
		transform.position.y += Time.deltaTime * pickupSpeed;

		var t = Mathf.InverseLerp (pickupTargetHeight1, pickupTargetHeight2, transform.position.y);
		transform.rotation = Quaternion.Slerp (fromRotation, toRotation, t);

		var worldCursorPos = cursor.GetWorldPosition (pickupTargetHeight2);
		transform.position.x = Mathf.Lerp (startPos.x, worldCursorPos.x, t);
		transform.position.z = Mathf.Lerp (startPos.z, worldCursorPos.z, t);

		yield;
	}
	
	m_pickingUp = false;
	// So we can move the coin around in Update once it's fully picked up
	manualControl = true;
}

function Update () {
	if (manualControl) {
		transform.position = cursor.GetWorldPosition (pickupTargetHeight2);
		// Flip coin if right mouse button or "f" key pressed
		if (Input.GetMouseButtonDown (1) || Input.GetKeyDown (KeyCode.F)) {
			DropCoin();
			GetComponent (AudioSource).clip = coinSound;
			GetComponent (AudioSource).Play();
			// Max angular velocity in the physics settings must be fairly high for AddTorque values like these to work properly
			GetComponent (Rigidbody).AddTorque (Random.Range (15.0, 40.0), 0.0, Random.Range (20.0, 40.0));
			GetComponent (Rigidbody).AddForce (0.0, Random.Range(250.0, 280.0), 0.0);
		}
	}
}

function DropCoinIfManualControl () {
	if (manualControl) {
		DropCoin();
	}
}