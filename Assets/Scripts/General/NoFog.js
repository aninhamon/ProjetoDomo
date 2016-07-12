// Disables fog on a camera
#pragma strict

private var fogActive : boolean;

function Awake () {
	fogActive = RenderSettings.fog;
}

function OnPreRender () {
	RenderSettings.fog = false;
}
 
function OnPostRender () {
	RenderSettings.fog = fogActive;
}
 
@script RequireComponent (Camera)