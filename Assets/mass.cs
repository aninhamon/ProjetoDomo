using UnityEngine;
using System.Collections;

public class mass : MonoBehaviour {
    
    private float timeCount;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
        timeCount += Time.deltaTime;
        if (timeCount == 20)
        {
            if(GetComponent<Rigidbody>().mass > 1)
                GetComponent<Rigidbody>().mass -= 1;
            timeCount = 0;
        }
            
	
	}
}
