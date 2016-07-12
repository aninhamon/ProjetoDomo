// Blinks object on and off at the specified interval
#pragma strict

var interval = 0.5;

function Start () {
	InvokeRepeating ("Blink", interval, interval);
}

function Blink () {
	gameObject.SetActive (!gameObject.activeInHierarchy);
}