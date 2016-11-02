using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;

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
    public AudioClip gameOverSound;
    public AudioClip youWinSound;
    public AudioClip dangerSound;

    public int damageCount;
    public int partida; 
	
	public TextMesh scoreText1;
    public TextMesh scoreText2;
    public GUIText restartText;
	public GUIText gameOverText;
    public TextMesh timeText1;
    public TextMesh timeText2;

    public bool gameOver;
	private bool restart;
	private int score;
    private float timeCount;
    private Vector3 soundPos;
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
        partida = 1;
        GetComponent<AudioSource>().volume = 10f;
    }
	
	void Update ()
	{
		if (restart)
		{
            if (Input.GetButtonDown("Reset"))
			{                
				//Application.LoadLevel (Application.loadedLevel);
                SceneManager.LoadScene("Done_Main");
                partida++;
            }
		}

        if(timeCount > 0)
        {
            if (!gameOver) {
                AddTime(-Time.deltaTime);
                print(damageCount);
                if (damageCount <= 0)
                {
                    //AudioSource.Destroy(dangerSound);
                    GameOver();
                } else if (damageCount < 5)
                {
                    GetComponent<AudioSource>().volume = 0.1f;
                    soundPos = new Vector3(0, 0);
                    AudioSource.PlayClipAtPoint(dangerSound, soundPos);
                }
            }
            
        } else
        {
            timeCount = 0;
            YouWin();
        }
	}
	
	IEnumerator SpawnWaves ()
	{
		yield return new WaitForSeconds (startWait);
        while (!gameOver)
        {
            if (Random.Range(0, 20) == 1)
            {
                GameObject bonus = bonuses[Random.Range(0, bonuses.Length)];
                Vector3 bonusPosition = new Vector3(Random.Range(-spawnValues.x, spawnValues.x), spawnValues.y, Random.Range((-spawnValues.z) / 3, spawnValues.z));
                Quaternion bonusRotation = Quaternion.identity;
                Instantiate(bonus, bonusPosition, bonusRotation);
            }
            //for (int i = 0; i < hazardCount; i++)
            //{
            GameObject hazard = hazards[Random.Range(0, hazards.Length)];
            Vector3 spawnPosition = setSpawnPosition();
            //Vector3 spawnPosition = new Vector3 (Random.Range (Random.Range(-spawnValues.x,-15f), Random.Range(15f,spawnValues.x)), spawnValues.y, Random.Range(Random.Range((-spawnValues.z)/3, -15f), Random.Range(15f, spawnValues.z)));
            //Vector3 spawnPosition = new Vector3(Random.Range(-10, 10), spawnValues.y, Random.Range((-spawnValues.z) / 3, spawnValues.z));
            //Vector3 spawnPosition = new Vector3(-10.047f, spawnValues.y, -0.018f);
            Quaternion spawnRotation = Quaternion.identity;
            Instantiate(hazard, spawnPosition, spawnRotation);
            yield return new WaitForSeconds(spawnWait);
            if (spawnWait > 2f)
            {
                spawnWait -= 1.5f;
            }
            if (timeCount == 150)
            {
                spawnWait = 1;
            }
            //}
            //yield return new WaitForSeconds (waveWait);
        }
		if (gameOver)
		{
			restartText.text = "Press 'R' or 'Back' for Restart";
			restart = true;
			//break;
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
		scoreText1.text = ""+score;
        scoreText2.text = "" + score;
    }

    public void AddTime(float newTimeValue)
    {
        timeCount += newTimeValue;
        UpdateTime();
    }

    void UpdateTime()
    {
        timeText1.text = "" + Mathf.Round(timeCount);
        timeText2.text = "" + Mathf.Round(timeCount);
    }

    public void GameOver ()
	{
        AudioSource.Destroy(dangerSound);
        gameOver = true;
        gameOverText.text = "Game Over!";
        GetComponent<AudioSource>().Pause();
        soundPos = new Vector3(0, 0);
        AudioSource.PlayClipAtPoint(gameOverSound, soundPos);
    }

    public void YouWin()
    {
        gameOverText.text = "You Survived!";
        gameOver = true;
        GetComponent<AudioSource>().Pause();
        soundPos = new Vector3(0, 0);
        AudioSource.PlayClipAtPoint(youWinSound, soundPos);
    }
}