#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;   
	int mid = (n + 1) / 2;
	for (int j = 1; j <= mid; j++) {// upper triangle including mid
		for (int k = 1; k <= j; k++) {
			cout << "*";
		}
		for (int k = 1; k <= ((n+1) - (2 * j)); k++) {
			cout << " ";
		}
		for (int l = 1; l <= j; l++) {
			cout << "*";
		}
		cout << endl;
	}
	for (int j = 1; j <= mid-1; j++) {//lower triangle 
		for (int k = mid-1; k >= j; k--) {
			cout << "*";
		}
		for (int k = n; k >= ((n + 1) - (2 * j)); k--) {
			cout << " ";
		}
		for (int l = j; l <=mid-1; l ++) {
			cout << "*";
		}
		cout << endl;
	}
	system("pause"); 
	return 0;
}

