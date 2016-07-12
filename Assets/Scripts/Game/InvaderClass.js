// A class for invaders, where each type has a different prefab, material, number of rows in the formation, and point value
#pragma strict

class Invader {
	var prefab : GameObject;
	var material : Material;
	var destroyedMaterial : Material;
	var rows : int;
	var points : int;
}