// Scrolls texture offset over time
#pragma strict

var scrollSpeed = .025;
private var offset = Vector2.zero;

function Update () {
	// Keep offset in 0..1 range; mobile platforms typically don't do well with UVs that are far from the origin
	offset.x = (offset.x + scrollSpeed * Time.deltaTime) % 1;
	GetComponent (Renderer).material.mainTextureOffset = offset;
}