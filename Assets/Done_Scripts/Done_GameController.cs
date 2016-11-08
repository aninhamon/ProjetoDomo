using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using System.IO;
using UnityEngine.UI;

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

    public int damageCount;
    public int partida; 
	
	public TextMesh scoreText1;
    public TextMesh scoreText2;
    public GUIText restartText;
	//public TextMesh gameOverText;
    public TextMesh timeText1;
    public TextMesh timeText2;
    public Text gameOverText1;
    public Text gameOverText2;

    public bool gameOver;
    private bool win;
    private bool salvo;
	private bool restart;
	private int score;
    private float timeCount;
    private bool isDangerPlaying;
    //private Time timeCount;

    void Start ()
	{
		gameOver = false;
        win = false;
		restart = false;
		restartText.text = "";
		//gameOverText.text = "";
		score = 0;
        timeCount = timeStart;
		UpdateScore ();
        UpdateTime();
        StartCoroutine (SpawnWaves ());
        partida = 1;
        GetComponent<AudioSource>().volume = 10f;
        salvo = false;
        isDangerPlaying = false;
        GameObject.FindGameObjectWithTag("DangerScreen").transform.position = new Vector3(0.07f, 40, 0);
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
            if (Input.GetButtonDown("BackMenu"))
            {
                //Application.LoadLevel (Application.loadedLevel);
                SceneManager.LoadScene("Start_Menu");
                partida++;
            }
        }

        if (!gameOver && !win)
        {
            if (timeCount > 0)
            {
                if (!gameOver)
                {
                    AddTime(-Time.deltaTime);
                    print(damageCount);
                    if (damageCount <= 0)
                    {
                        GameOver();
                    }
                    else if (damageCount < 3)
                    {

                        if (!isDangerPlaying)
                        {
                            GetComponent<AudioSource>().volume = 0.2f;
                            GameObject.FindGameObjectWithTag("Danger").GetComponent<AudioSource>().Play();
                            isDangerPlaying = true;
                            GameObject.FindGameObjectWithTag("DangerScreen").transform.position = new Vector3(0.07f, 11, 0);
                        }
                    }
                }

            }
            else
            {
                timeCount = 0;                
                YouWin();
            }
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
        gameOver = true;
        //gameOverText.text = "Game Over!";
        gameOverText1.text = "Game Over!";
        gameOverText2.text = "Game Over!";
        if (isDangerPlaying) {
            GameObject.FindGameObjectWithTag("Danger").GetComponent<AudioSource>().Pause();
        }

        GameObject.FindGameObjectWithTag("GameOver").GetComponent<AudioSource>().Play();

        if (!salvo)
        {
            if (!File.Exists("ranking.txt"))
            {
                TextWriter tw = new StreamWriter("ranking.txt");
                tw.WriteLine("Partida " + partida + " - " + score + "pontos.");
                tw.Close();
            }
            else if (File.Exists("ranking.txt"))
            {
                TextWriter tw = new StreamWriter("ranking.txt", true);
                tw.WriteLine("Partida " + partida + " - " + score + " pontos.");
                tw.Close();
            }
            salvo = true;
        }
    }

    public void YouWin()
    {
        win = true;
        //gameOverText.text = "You Survived!";
        gameOverText1.text = "You Survived!";
        gameOverText2.text = "You Survived!";
        gameOver = true;
        GameObject.FindGameObjectWithTag("DangerScreen").transform.position = new Vector3(0.07f, 40, 0);
        GetComponent<AudioSource>().Pause();
        if (isDangerPlaying)
        {
            GameObject.FindGameObjectWithTag("Danger").GetComponent<AudioSource>().Pause();
        }

        //GameObject.FindGameObjectWithTag("GameOver").GetComponent<AudioSource>().Play();

        GameObject.FindGameObjectWithTag("YouWinTag").GetComponent<AudioSource>().Play();

        if (!salvo)
        {
            if (!File.Exists("ranking.txt"))
            {
                TextWriter tw = new StreamWriter("ranking.txt");
                tw.WriteLine("Partida " + partida + " - " + score + "pontos.");
                tw.Close();
            }
            else if (File.Exists("ranking.txt"))
            {
                TextWriter tw = new StreamWriter("ranking.txt", true);
                tw.WriteLine("Partida " + partida + " - " + score + " pontos.");
                tw.Close();
            }
            salvo = true;
        }
    }
}