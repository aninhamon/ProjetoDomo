// Moves GUI image around screen with mouse
// This is used instead of Cursor.SetCursor because we want to change the color at times
#pragma strict
import UnityEngine.UI;

var coinCamera : Camera;
var coin : CoinControl;
var openHand : Sprite;
var closedHand : Sprite;
var highlightColor = Color(0.0, 1.0, 1.0, 0.6);
var defaultColor = Color.gray;

function Start () {
	GetComponent (Image).color = defaultColor;
}

function Update () {
	var mousePos = Input.mousePosition;
	GetComponent (RectTransform).anchoredPosition = mousePos;
	// Disable the hardware cursor and enabled the GUI image if the mouse is inside the coin camera viewport
	if (Rect(0, 0, 1, 1).Contains (coinCamera.ScreenToViewportPoint (mousePos))) {
		GetComponent (Image).enabled = true;
		ShowHardwareCursor (false);
	}
	else {
		GetComponent (Image).enabled = false;
		ShowHardwareCursor (true);
		coin.DropCoinIfManualControl();	// Drop coin if cursor is outside viewport and coin is under manual control
	}
}

function ShowHardwareCursor (cursorActive : boolean) {
#if UNITY_4_6
	Screen.showCursor = cursorActive;
#else
	Cursor.visible = cursorActive;
#endif
}

// Other scripts call these functions when they need to set the cursor highlight color, sprite image, or get the world position
function CursorHighlight (highlightActive : boolean) {
	GetComponent (Image).color = highlightActive? highlightColor : defaultColor;
}

function SetHandClosed (handClosed : boolean) {
	GetComponent (Image).sprite = handClosed? closedHand : openHand;
}

function GetWorldPosition (targetHeight : float) : Vector3 {
	var mousePos = Input.mousePosition;
	// ScreenToWorldPoint uses the distance from the camera, so get that by subtracting the target height from the camera's Y position
	return coinCamera.ScreenToWorldPoint (Vector3(mousePos.x, mousePos.y, coinCamera.transform.position.y - targetHeight));
}