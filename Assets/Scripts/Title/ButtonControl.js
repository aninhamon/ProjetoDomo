// Functions for controlling the "Controls" button
#pragma strict
import UnityEngine.UI;

var pushDistance = 0.055;
var scrollSpeed = 90.0;
var cursor : CursorControl;
var insertCoinText : GameObject;
var controlsText : GameObject;
var textStartPos = 100;
var textFadePos = -1950;
var textEndPos = -2250;

function OnMouseDown () {
	GetComponent (AudioSource).Play();
	StopAllCoroutines();	// This will interrupt the ScrollText and Fade routines if necessary
	ScrollText();

	transform.Translate (Vector3.up * -pushDistance);
	cursor.SetHandClosed (true);
}

function OnMouseUp () {
	transform.Translate (Vector3.up * pushDistance);
	cursor.SetHandClosed (false);
}

function OnMouseOver () {
	cursor.CursorHighlight (true);
}

function OnMouseExit () {
	cursor.CursorHighlight (false);
}

function ScrollText () : IEnumerator {
	cursor.CursorHighlight (false);
	insertCoinText.GetComponent (Text).enabled = false;
	controlsText.GetComponent (Text).enabled = true;

	FadeText (controlsText.GetComponent (Text), 0.0, 1.0, .4);	// Fade text in at beginning
	var isFading = false;
	for (var i : float = textStartPos; i > textEndPos; i -= Time.deltaTime * scrollSpeed) {
		controlsText.transform.localPosition.x = i;
		if (i < textFadePos && !isFading) {						// Trigger fade out text when hitting the fade position
			FadeText (controlsText.GetComponent (Text), 1.0, 0.0, 2.0);
			isFading = true;
		}
		yield;
	}
	
	insertCoinText.GetComponent (Text).enabled = true;
	controlsText.GetComponent (Text).enabled = false;
}

function FadeText (text : Text, start : float, end : float, fadeSpeed : float) : IEnumerator {
	var t = 0.0;
	while (t <= 1.0) {
		t += Time.deltaTime / fadeSpeed;
		text.color.a = Mathf.Lerp (start, end, t);
		yield;
	}
}