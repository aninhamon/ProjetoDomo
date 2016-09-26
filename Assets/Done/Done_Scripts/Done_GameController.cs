using UnityEngine;
using System.Collections;

public class Done_GameController : MonoBehaviour
{
	public GameObject[] hazards;
    public GameObject[] bonuses;
    public Vector3 spawnValues;
    public Vector3 bonusValues;
    //public int hazardCount;
    public float spawnWait;
	public float startWait;
	//public float waveWait;
    public float timeStart;
	
	public GUIText scoreText;
	public GUIText restartText;
	public GUIText gameOverText;
    public GUIText timeText;

    private bool gameOver;
	private bool restart;
	private int score;
    private float timeCount;
    //private Time timeCount;

    void Start ()
	{
		gameOver = false;
		restart = false;
		restartText.text = "";
		gameOverText.text = "";
		score = 0;
        timeCount = timeStart;
		UpdateScore ();
        UpdateTime();
        StartCoroutine (SpawnWaves ());
	}
	
	void Update ()
	{
		if (restart)
		{
			if (Input.GetKeyDown (KeyCode.R))
			{
				Application.LoadLevel (Application.loadedLevel);
			}
		}

        if(timeCount > 0)
        {
            AddTime(-Time.deltaTime);
        } else
        {
            timeCount = 0;
            GameOver();
        }
	}
	
	IEnumerator SpawnWaves ()
	{
		yield return new WaitForSeconds (startWait);
		while (true)
		{
            if(Random.Range(0, 10) == 1)
            {
                GameObject bonus = bonuses[Random.Range(0, bonuses.Length)];
                Vector3 bonusPosition = new Vector3(Random.Range(-spawnValues.x, spawnValues.x), spawnValues.y, Random.Range((-spawnValues.z) / 3, spawnValues.z));
                Quaternion bonusRotation = Quaternion.identity;
                Instantiate(bonus, bonusPosition, bonusRotation);
            }
			//for (int i = 0; i < hazardCount; i++)
			//{
				GameObject hazard = hazards [Random.Range (0, hazards.Length)];
                Vector3 spawnPosition = setSpawnPosition();
                //Vector3 spawnPosition = new Vector3 (Random.Range (Random.Range(-spawnValues.x,-15f), Random.Range(15f,spawnValues.x)), spawnValues.y, Random.Range(Random.Range((-spawnValues.z)/3, -15f), Random.Range(15f, spawnValues.z)));
                //Vector3 spawnPosition = new Vector3(Random.Range(-10, 10), spawnValues.y, Random.Range((-spawnValues.z) / 3, spawnValues.z));
                //Vector3 spawnPosition = new Vector3(-10.047f, spawnValues.y, -0.018f);
            Quaternion spawnRotation = Quaternion.identity;
				Instantiate (hazard, spawnPosition, spawnRotation);
				yield return new WaitForSeconds (spawnWait);
			//}
			//yield return new WaitForSeconds (waveWait);
			
			if (gameOver)
			{
				restartText.text = "Press 'R' for Restart";
				restart = true;
				break;
			}
		}
	}

    Vector3 setSpawnPosition()
    {
        Vector3 spawnPosition;
        switch (Random.Range(1, 5))
        {
            case 1:
                spawnPosition = new Vector3(Random.Range(5f, spawnValues.x), spawnValues.y, Random.Range(5f, spawnValues.z));
                return spawnPosition;
            case 2:
                spawnPosition = new Vector3(Random.Range(-spawnValues.x, -5f), spawnValues.y, Random.Range(5f, spawnValues.z));
                return spawnPosition; ;
            case 3:
                spawnPosition = new Vector3(Random.Range(-spawnValues.x, -5f), spawnValues.y, Random.Range(-spawnValues.z, -5f));
                return spawnPosition; ;
        }
        spawnPosition = new Vector3(Random.Range(5f, spawnValues.x), spawnValues.y, Random.Range(-spawnValues.z, -5f));
        return spawnPosition; ;
        
    }
	
	public void AddScore (int newScoreValue)
	{
		score += newScoreValue;
		UpdateScore ();
	}
	
	void UpdateScore ()
	{
		scoreText.text = "Score: " + score;
	}

    public void AddTime(float newTimeValue)
    {
        timeCount += newTimeValue;
        UpdateTime();
    }

    void UpdateTime()
    {
        timeText.text = "Time: " + Mathf.Round(timeCount);
    }

    public void GameOver ()
	{
		gameOverText.text = "Game Over!";
		gameOver = true;
	}
}