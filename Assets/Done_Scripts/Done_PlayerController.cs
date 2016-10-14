using UnityEngine;
using System.Collections;

[System.Serializable]
public class Done_Boundary 
{
	public float xMin, xMax, zMin, zMax;
}

public class Done_PlayerController : MonoBehaviour
{
	public float speed;
	public float tilt;
	public Done_Boundary boundary;
    public string fireButton = "Fire_P1";
    public string horizontalButton = "Horizontal_P1";
    public string verticalButton = "Vertical_P1";

    public GameObject shot;
	public Transform shotSpawn;
	public float fireRate;
	 
	private float nextFire;

    Vector3 CartesianToPolar(Vector3 point)
    {
        Vector3 polar;
 
        //calc longitude
        polar.z = Mathf.Atan2(point.x,point.z);

        //this is easier to write and read than sqrt(pow(x,2), pow(y,2))!
        float xzLen = Mathf.Sqrt(Mathf.Pow(point.x, 2) + Mathf.Pow(point.y, 2)); //Vector2(point.x, point.z).magnitude;
        //atan2 does the magic
        polar.x = Mathf.Atan2(-point.x,xzLen);

        polar.y = 0.0f;
 
        //convert to deg
        polar *= Mathf.Rad2Deg;
 
         return polar;
    }

    void Update ()
	{
		if (Input.GetButton(fireButton) && Time.time > nextFire) 
		{
			nextFire = Time.time + fireRate;
			Instantiate(shot, shotSpawn.position, shotSpawn.rotation);
			GetComponent<AudioSource>().Play ();
		}
	}

	void FixedUpdate ()
	{
		float moveHorizontal = Input.GetAxis (horizontalButton);
		float moveVertical = Input.GetAxis (verticalButton);

        Vector3 movement = new Vector3 (moveHorizontal, 0.0f, moveVertical);

        //Vector2 pos = CartesianToPolar(movement);

        GetComponent<Rigidbody>().velocity = movement * speed;
		
		GetComponent<Rigidbody>().position = new Vector3
		(
			Mathf.Clamp (GetComponent<Rigidbody>().position.x, boundary.xMin, boundary.xMax), 
			0.0f, 
			Mathf.Clamp (GetComponent<Rigidbody>().position.z, boundary.zMin, boundary.zMax)
		);
		
		GetComponent<Rigidbody>().rotation = Quaternion.Euler (0.0f, 0.0f, GetComponent<Rigidbody>().velocity.x * -tilt);
	}
}
