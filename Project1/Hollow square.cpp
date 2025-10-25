#include<iostream>
using namespace std;
int main() {
	int n;
	cin >> n;
	for (int j = 1; j <= n; j++) {
		for (int k = 1; k <= n; k++) {
			if (j == 1 || j == n){
				cout << "*";
			}
			else if (k == 1 || k == n) {
				cout << "*";
			}
			else {
				cout << " ";
			}
		}
		cout << endl;
	}
	system("pause");
	return 0;
}