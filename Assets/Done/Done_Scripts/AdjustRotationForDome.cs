using UnityEngine;
using System.Collections;
using System;

public class AdjustRotationForDome : MonoBehaviour {

    //ainda vai usar:
    // Vector3 alienCenter
    // Vector3 alienTop


    // Use this for initialization
    void Start()
    {
        //Centro do domo, topo
        double[] A = new double[2];
        A[0] = 0;
        A[1] = 0;

        //Centro do alien no momento em que aparece
        double[] B = new double[2];

        B[0] = GetComponent<RectTransform>().position.x;
        B[1] = GetComponent<RectTransform>().position.z; 

        Vector3 teste = GetComponent<BoxCollider>().bounds.center;

        if (!(Math.Truncate(B[0]) == 0 && B[1] <= 0))
        {

            //Centro do topo do alien no momento em que aparece
            double[] C = new double[2];
            C[0] = GetComponent<RectTransform>().position.x;
            C[1] = GetComponent<RectTransform>().position.z + (GetComponent<BoxCollider>().size.z / 4);


            //Passo 1: calcular coeficientes angulares (CA = deltaY / deltaX)
            double caBA = (B[1] - A[1]) / (B[0] - A[0]);
            double caBC = (B[1] - C[1]) / (B[0] - C[0]);

            //Passo 2: calcular a Arctg de cada CA
            double arctgBA = Math.Atan(caBA);

            bool isObtuse = false;

            if (B[0] > 0)
            {
                if (B[1] >= 0)
                {
                    // x positivo, y positivo
                    isObtuse = true;
                }
                else
                {
                    // x positivo, y negativo
                    isObtuse = false;
                }
            }
            else
            {
                if (B[1] >= 0)
                {
                    //x negativo, y positivo
                    isObtuse = true;
                }
                else
                {
                    //x negativo, y negativo
                    isObtuse = false;
                }
            }

            double arctgBC = (isObtuse) ? Math.Atan(caBC) : 0;

            //Passo 3: calcular angulo resultante
            double angulo = (Math.Abs(arctgBA) + Math.Abs(arctgBC)) * (180 / Math.PI);

            //Passo 4: rotacionar alien
            //rotateDirection 1 = direita ; -1 = esquerda
            int rotateDirection = (B[0] > 0) ? -1 : 1;
        }

            /*TESTE*/

            //Centro do alien no momento em que aparece
           
            if (!(Math.Truncate(B[0]) == 0 && B[1] <= 0))
            {

                //Centro do topo do alien no momento em que aparece
                double[] C = new double[2];
                C[0] = GetComponent<BoxCollider>().bounds.center.x;
                print(GetComponent<BoxCollider>().size.z);
                C[1] = GetComponent<BoxCollider>().bounds.center.z + (GetComponent<BoxCollider>().size.z / 4);


                //Passo 1: calcular coeficientes angulares (CA = deltaY / deltaX)
                double caBA = (B[1] - A[1]) / (B[0] - A[0]);
                double caBC = (B[1] - C[1]) / (B[0] - C[0]);

                //Passo 2: calcular a Arctg de cada CA
                double arctgBA = Math.Atan(caBA);

                bool isObtuse = false;

                if (B[0] > 0)
                {
                    if (B[1] >= 0)
                    {
                        // x positivo, y positivo
                        isObtuse = true;
                    }
                    else
                    {
                        // x positivo, y negativo
                        isObtuse = false;
                    }
                }
                else
                {
                    if (B[1] >= 0)
                    {
                        //x negativo, y positivo
                        isObtuse = true;
                    }
                    else
                    {
                        //x negativo, y negativo
                        isObtuse = false;
                    }
                }

                double arctgBC = (isObtuse) ? Math.Atan(caBC) : 0;

                //Passo 3: calcular angulo resultante
                double angulo = (Math.Abs(arctgBA) + Math.Abs(arctgBC)) * (180 / Math.PI);


            //Passo 4: rotacionar alien
            //rotateDirection 1 = direita ; -1 = esquerda
            int rotateDirection = (B[0] > 0) ? -1 : 1;

            /*/TESTE*/

            this.transform.eulerAngles = new Vector3(
                this.transform.eulerAngles.x,
                (float)angulo * rotateDirection,
                this.transform.eulerAngles.z);
        }     
        
    }

    // Update is called once per frame
    void Update () {
	
	}
    
}
