#pragma strict
import UnityEngine.UI;

var insertCoinText : Text;
var title3D : Transform;
var titleEndPos = Vector3(-1.2, 1.5, -10.2);
var titleEndRotation = Vector3(-0.6, 175, -19.8);
var startTimeLength = 5.0;

private var canStartGame = true;

function Start () : IEnumerator {
	// The coin is made on a large scale due to physics stability, so we speed up time to make it look better
	Time.timeScale = 1.5;
	
	// Indicate loading progress, when running on the web
	if (Application.platform == RuntimePlatform.OSXWebPlayer || Application.platform == RuntimePlatform.WindowsWebPlayer) {
		var progress = 0.0;
		canStartGame = false;
		while (progress < 1.0) {
			progress = Application.GetStreamProgressForLevel ("MainGame");
			insertCoinText.text = progress.ToString ("##") + " percent loaded";
			yield;
		}
		insertCoinText.text = "Insert Coin";
		canStartGame = true;
	}
}

function Update () {
	if (Input.GetButtonDown ("Fire")) {
		StartGame();
	}
}

function StartGame () : IEnumerator {
	// Wait until game level is loaded, when running on the web
	while (!canStartGame) {
		yield;
	}
	
	title3D.GetComponent (AudioSource).Play();
	insertCoinText.enabled = false;
	
	var startPos = title3D.position;
	var startRotation = title3D.rotation;
	var endRotation = Quaternion.Euler (titleEndRotation);
	var t = 0.0;
	var timeRatio = 1.0 / startTimeLength;
	
	// Move 3D title text to target orientation, and fade out the music
	while (t < 1.0) {
		t += Time.deltaTime * timeRatio;
		var easeIn = Mathf.Lerp (0.0, 1.0, 1.0 - Mathf.Cos (t * Mathf.PI * 0.5));
		title3D.position = Vector3.Lerp (startPos, titleEndPos, easeIn);
		title3D.rotation = Quaternion.Slerp (startRotation, endRotation, easeIn);
		GetComponent (AudioSource).volume = Mathf.Lerp (1.0, 0.0, t*1.5);
		yield;
	}
	
	Application.LoadLevel ("MainGame");
}