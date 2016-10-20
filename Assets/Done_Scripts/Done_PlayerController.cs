using UnityEngine;
using System.Collections;

[System.Serializable]
public class Done_Boundary 
{
	public float xMin, xMax, zMin, zMax;
}

public class Done_PlayerController : MonoBehaviour
{
    public string horizontalButton = "Horizontal_P1";
    public string verticalButton = "Vertical_P1";

    public string fireButton = "Fire_P1";
    public GameObject shot;
    public Transform shotSpawn;
    public float fireRate;
    private float nextFire;

    public float rotateSpeed = 1f, scrollSpeed = 200f;
    public Transform pivot;

    public SphericalCoordinates sc;

    private void Start()
    {
        sc = new SphericalCoordinates(transform.position, 3f, 4.3f, 0f, Mathf.PI * 2f, 0f, Mathf.PI / 4f);
        // Initialize position
        transform.position = sc.toCartesian + pivot.position;
    }

    void Update()
    {
        if (Input.GetButton(fireButton) && Time.time > nextFire)
        {
            nextFire = Time.time + fireRate;
            Instantiate(shot, shotSpawn.position, shotSpawn.rotation);
            GetComponent<AudioSource>().Play();
            Destroy(shot, 0.5f);
        }
    }

    void FixedUpdate()
    {
        float kh, kv, mh, mv, h;
        kh = Input.GetAxis(horizontalButton);
        kv = Input.GetAxis(verticalButton);

        bool anyMouseButton = Input.GetMouseButton(0) | Input.GetMouseButton(1) | Input.GetMouseButton(2);
        mh = anyMouseButton ? Input.GetAxis("Mouse X") : 0f;
        mv = anyMouseButton ? Input.GetAxis("Mouse Y") : 0f;

        h = 0;

        if (Input.GetAxis(horizontalButton) != 0)
        {
            h = kh * kh > mh * mh ? kh : mh;            
        }

        if (Input.GetAxis(verticalButton) != 0)
        {
            if(Input.GetAxis(verticalButton) > 0)
            {
                if (sc.radius > 3f)
                {
                    sc.SetRadius(sc.radius - 0.1f);
                }
            }else
            {
                if (sc.radius < 4.3f)
                {
                    sc.SetRadius(sc.radius + 0.1f);
                }
            }
        }
                
        transform.position = sc.Rotate(h * rotateSpeed * Time.deltaTime, 0).toCartesian + pivot.position;

        transform.LookAt(pivot.position);

    }



    /*public float speed;
	public float tilt;
	public Done_Boundary boundary;
    public string fireButton = "Fire_P1";
    

    public GameObject shot;
	public Transform shotSpawn;
	public float fireRate;
	 
	private float nextFire;

    //NOVO
    public float rotateSpeed = 1f, scrollSpeed = 200f;
    public Transform pivot;

    public SphericalCoordinates sc;

    private void Start()
    {
        sc = new SphericalCoordinates(transform.position, 3f, 10f, 0f, Mathf.PI * 2f, 0f, Mathf.PI / 4f);
        // Initialize position
        transform.position = sc.toCartesian + pivot.position;
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
        /*float moveHorizontal = Input.GetAxis (horizontalButton);
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
        }*/

}
