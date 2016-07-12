// Fades light over time
#pragma strict

var lightIntensity = 2.0;
var fadeSpeed = 1.0;

private var intensity : float;

function OnEnable () {
	intensity = lightIntensity;
}

function Update () {
	intensity = Mathf.Max (intensity - Time.deltaTime*fadeSpeed, 0.0);
	GetComponent (Light).intensity = intensity;
}