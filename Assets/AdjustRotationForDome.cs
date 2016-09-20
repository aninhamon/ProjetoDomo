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
        B[0] = GetComponent<BoxCollider>().bounds.center.x;
        B[1] = GetComponent<BoxCollider>().bounds.center.z;

        if (!(Math.Truncate(B[0]) == 0 && B[1] <= 0))
        {

            //Centro do topo do alien no momento em que aparece
            double[] C = new double[2];
            C[0] = GetComponent<BoxCollider>().bounds.center.x;            
            C[1] = GetComponent<BoxCollider>().bounds.center.z - (GetComponent<BoxCollider>().size.z / 2);
           

            //Passo 1: calcular coeficientes angulares (CA = deltaY / deltaX)
            double caBA = (B[1] - A[1]) / (B[0] - A[0]);
            double caBC = (B[1] - C[1]) / (B[0] - C[0]);

            //Passo 2: calcular a Arctg de cada CA
            double arctgBA = Math.Atan(caBA);

            bool isObtuse = false;

            if (B[0] > 0)
            {
                if (B[1] > 0)
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
                if (B[1] > 0)
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
            //TESTE
            print("O resultado foi: " + angulo);


            //Passo 4: rotacionar alien
            //rotateDirection 1 = direita ; -1 = esquerda
            int rotateDirection = (B[0] > 0) ? -1 : 1;

            this.transform.eulerAngles = new Vector3(
                this.transform.eulerAngles.x,
                (float)angulo * rotateDirection,
                this.transform.eulerAngles.z);
        }     
        
    }

    /// <summary>Computes the solution of a linear equation system.</summary>
    /// <param name="M">
    /// The system of linear equations as an augmented matrix[row, col] where (rows + 1 == cols).
    /// It will contain the solution in "row canonical form" if the function returns "true".
    /// </param>
    /// <returns>Returns whether the matrix has a unique solution or not.</returns>
    static bool resolveSistema(float[,] M)
    {
        // input checks
        int rowCount = M.GetUpperBound(0) + 1;
        if (M == null || M.Length != rowCount * (rowCount + 1))
            throw new ArgumentException("The algorithm must be provided with a (n x n+1) matrix.");
        if (rowCount < 1)
            throw new ArgumentException("The matrix must at least have one row.");

        // pivoting
        for (int col = 0; col + 1 < rowCount; col++) if (M[col, col] == 0)
            // check for zero coefficients
            {
                // find non-zero coefficient
                int swapRow = col + 1;
                for (; swapRow < rowCount; swapRow++) if (M[swapRow, col] != 0) break;

                if (M[swapRow, col] != 0) // found a non-zero coefficient?
                {
                    // yes, then swap it with the above
                    float[] tmp = new float[rowCount + 1];
                    for (int i = 0; i < rowCount + 1; i++)
                    { tmp[i] = M[swapRow, i]; M[swapRow, i] = M[col, i]; M[col, i] = tmp[i]; }
                }
                else return false; // no, then the matrix has no unique solution
            }

        // elimination
        for (int sourceRow = 0; sourceRow + 1 < rowCount; sourceRow++)
        {
            for (int destRow = sourceRow + 1; destRow < rowCount; destRow++)
            {
                float df = M[sourceRow, sourceRow];
                float sf = M[destRow, sourceRow];
                for (int i = 0; i < rowCount + 1; i++)
                    M[destRow, i] = M[destRow, i] * df - M[sourceRow, i] * sf;
            }
        }

        // back-insertion
        for (int row = rowCount - 1; row >= 0; row--)
        {
            float f = M[row, row];
            if (f == 0) return false;

            for (int i = 0; i < rowCount + 1; i++) M[row, i] /= f;
            for (int destRow = 0; destRow < row; destRow++)
            { M[destRow, rowCount] -= M[destRow, row] * M[row, rowCount]; M[destRow, row] = 0; }
        }
         return true;
    }

    // Update is called once per frame
    void Update () {
	
	}
    
}
