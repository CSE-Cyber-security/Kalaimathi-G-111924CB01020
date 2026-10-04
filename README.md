# Fibonacci Series for N Terms – Python

## 📌 Problem Statement

Write a Python program to generate the Fibonacci series for `N` terms.

In the Fibonacci series, each term is the sum of the two preceding terms. The series starts with `0` and `1`.

Example:

`0, 1, 1, 2, 3, 5, 8, 13, ...`

## 📥 Input

The program takes a positive integer `N`, representing the number of terms to be printed.

### Example Input

```text
7
📤 Output

Print the first N terms of the Fibonacci series.

Example Output
0 1 1 2 3 5 8
💡 Another Example
Input
10
Output
0 1 1 2 3 5 8 13 21 34
🛠️ Technologies Used
Python 3
▶️ Instructions to Run
Make sure Python 3 is installed on your system.
Open the terminal or command prompt.
Navigate to the folder containing fibonacci.py.
Run the following command:
python fibonacci.py
Enter the number of terms when prompted.
The program will display the Fibonacci series.
🧠 Logic

The program starts with two values:

a = 0
b = 1

For every iteration, it prints the current value of a and updates the values:

a, b = b, a + b

For N = 7:

0 1 1 2 3 5 8
🎯 Concepts Used
User Input
Variables
for Loop
range()
Arithmetic Operations
Multiple Assignment
Basic Problem Solving

Available next action: :contentReference[oaicite:0]{index=0}
