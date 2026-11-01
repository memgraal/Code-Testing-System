import { Task } from '../types';

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    category: 'Arrays & Hash Maps',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the indices separated by a space in ascending order.`,
    inputFormat: `Line 1: An integer N (length of array) and target integer T
Line 2: N space-separated integers`,
    outputFormat: `Two space-separated 0-based indices i and j (i < j)`,
    constraints: [
      '2 <= N <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists',
    ],
    timeLimitSec: 2.0,
    memoryLimitMb: 256,
    allowedLanguages: ['python', 'cpp', 'java'],
    defaultFiles: {
      python: [
        {
          id: 'ts-py-main',
          name: 'main.py',
          isMain: true,
          content: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    
    n = int(lines[0])
    target = int(lines[1])
    nums = [int(x) for x in lines[2:2+n]]
    
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            print(f"{lookup[diff]} {i}")
            return
        lookup[num] = i

if __name__ == '__main__':
    solve()
`,
        },
      ],
      cpp: [
        {
          id: 'ts-cpp-main',
          name: 'main.cpp',
          isMain: true,
          content: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;

    vector<long long> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    unordered_map<long long, int> seen;
    for (int i = 0; i < n; i++) {
        long long diff = target - nums[i];
        if (seen.find(diff) != seen.end()) {
            cout << seen[diff] << " " << i << "\\n";
            return 0;
        }
        seen[nums[i]] = i;
    }

    return 0;
}
`,
        },
      ],
      java: [
        {
          id: 'ts-java-main',
          name: 'Main.java',
          isMain: true,
          content: `import java.util.Scanner;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextInt()) return;
        int n = scanner.nextInt();
        long target = scanner.nextLong();

        long[] nums = new long[n];
        for (int i = 0; i < n; i++) {
            nums[i] = scanner.nextLong();
        }

        HashMap<Long, Integer> seen = new HashMap<>();
        for (int i = 0; i < n; i++) {
            long diff = target - nums[i];
            if (seen.containsKey(diff)) {
                System.out.println(seen.get(diff) + " " + i);
                return;
            }
            seen.put(nums[i], i);
        }
    }
}
`,
        },
      ],
    },
    testCases: [
      {
        id: 'tc-ts-1',
        name: 'Sample 1: Basic pair',
        input: '4 9\n2 7 11 15\n',
        expectedOutput: '0 1\n',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
      },
      {
        id: 'tc-ts-2',
        name: 'Sample 2: Elements at middle & end',
        input: '3 6\n3 2 4\n',
        expectedOutput: '1 2\n',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6',
      },
      {
        id: 'tc-ts-3',
        name: 'Sample 3: Duplicate values',
        input: '2 6\n3 3\n',
        expectedOutput: '0 1\n',
      },
      {
        id: 'tc-ts-4',
        name: 'Hidden Test 1: Negative numbers',
        input: '5 -2\n-5 3 2 -4 8\n',
        expectedOutput: '2 3\n',
        isHidden: true,
      },
      {
        id: 'tc-ts-5',
        name: 'Hidden Test 2: Large values',
        input: '4 1000000000\n500000000 123 500000000 999\n',
        expectedOutput: '0 2\n',
        isHidden: true,
      },
    ],
  },
  {
    id: 'csv-data-analyzer',
    title: 'CSV Data File Analyzer',
    difficulty: 'Medium',
    category: 'System Files & Data Processing',
    description: `As illustrated in the system architecture diagram (\`image.png\`), tests can mount data files (e.g. \`.csv\`, \`.npy\`) directly into the sandbox folder \`/sandbox/data.csv\`.

Your program must read the system data file \`data.csv\` already present in current directory, filter employees whose sales exceed a minimum threshold $T$ given via stdin, and print the count and average rating of those employees formatted to 2 decimal places.`,
    inputFormat: `Line 1: A single integer T (sales threshold)`,
    outputFormat: `Count of qualifying employees and average rating formatted as:
COUNT: <N> | AVG_RATING: <X.XX>`,
    constraints: [
      'data.csv is located in working directory',
      '0 <= T <= 100000',
    ],
    timeLimitSec: 2.0,
    memoryLimitMb: 256,
    allowedLanguages: ['python', 'cpp', 'java'],
    dataFiles: [
      {
        id: 'data-csv-1',
        name: 'data.csv',
        type: 'data',
        isReadOnly: true,
        content: `id,name,department,sales,rating
101,Alice,Engineering,45000,4.8
102,Bob,Sales,72000,4.2
103,Charlie,Marketing,31000,3.9
104,Diana,Sales,89000,4.9
105,Evan,Engineering,65000,4.5
106,Fiona,Support,28000,4.1
107,George,Sales,94000,4.7
108,Hannah,Marketing,51000,4.3
`,
      },
    ],
    defaultFiles: {
      python: [
        {
          id: 'csv-py-main',
          name: 'main.py',
          isMain: true,
          content: `import sys
import csv

def solve():
    threshold_str = sys.stdin.read().strip()
    if not threshold_str:
        return
    threshold = float(threshold_str)

    count = 0
    total_rating = 0.0

    try:
        with open('data.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                sales = float(row['sales'])
                rating = float(row['rating'])
                if sales >= threshold:
                    count += 1
                    total_rating += rating
    except FileNotFoundError:
        print("ERROR: data.csv not found")
        return

    if count == 0:
        print("COUNT: 0 | AVG_RATING: 0.00")
    else:
        avg = total_rating / count
        print(f"COUNT: {count} | AVG_RATING: {avg:.2f}")

if __name__ == '__main__':
    solve()
`,
        },
      ],
      cpp: [
        {
          id: 'csv-cpp-main',
          name: 'main.cpp',
          isMain: true,
          content: `#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <iomanip>

using namespace std;

int main() {
    double threshold;
    if (!(cin >> threshold)) return 0;

    ifstream file("data.csv");
    if (!file.is_open()) {
        cout << "ERROR: data.csv not found\\n";
        return 0;
    }

    string line;
    getline(file, line); // skip header: id,name,department,sales,rating

    int count = 0;
    double totalRating = 0.0;

    while (getline(file, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string id, name, dept, salesStr, ratingStr;
        getline(ss, id, ',');
        getline(ss, name, ',');
        getline(ss, dept, ',');
        getline(ss, salesStr, ',');
        getline(ss, ratingStr, ',');

        double sales = stod(salesStr);
        double rating = stod(ratingStr);

        if (sales >= threshold) {
            count++;
            totalRating += rating;
        }
    }

    cout << fixed << setprecision(2);
    if (count == 0) {
        cout << "COUNT: 0 | AVG_RATING: 0.00\\n";
    } else {
        cout << "COUNT: " << count << " | AVG_RATING: " << (totalRating / count) << "\\n";
    }

    return 0;
}
`,
        },
      ],
      java: [
        {
          id: 'csv-java-main',
          name: 'Main.java',
          isMain: true,
          content: `import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Locale;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        if (!in.hasNextDouble()) return;
        double threshold = in.nextDouble();
        in.close();

        File file = new File("data.csv");
        if (!file.exists()) {
            System.out.println("ERROR: data.csv not found");
            return;
        }

        int count = 0;
        double totalRating = 0.0;

        try {
            Scanner fileScanner = new Scanner(file);
            if (fileScanner.hasNextLine()) {
                fileScanner.nextLine(); // skip header
            }
            while (fileScanner.hasNextLine()) {
                String line = fileScanner.nextLine().trim();
                if (line.isEmpty()) continue;
                String[] parts = line.split(",");
                if (parts.length >= 5) {
                    double sales = Double.parseDouble(parts[3]);
                    double rating = Double.parseDouble(parts[4]);
                    if (sales >= threshold) {
                        count++;
                        totalRating += rating;
                    }
                }
            }
            fileScanner.close();
        } catch (FileNotFoundException e) {
            System.out.println("ERROR: data.csv not found");
            return;
        }

        if (count == 0) {
            System.out.println("COUNT: 0 | AVG_RATING: 0.00");
        } else {
            System.out.printf(Locale.US, "COUNT: %d | AVG_RATING: %.2f%n", count, totalRating / count);
        }
    }
}
`,
        },
      ],
    },
    testCases: [
      {
        id: 'tc-csv-1',
        name: 'Test 1: High threshold (>= 70000)',
        input: '70000\n',
        expectedOutput: 'COUNT: 3 | AVG_RATING: 4.60\n',
        explanation: 'Bob (72k, 4.2), Diana (89k, 4.9), George (94k, 4.7). Avg = (4.2+4.9+4.7)/3 = 4.60',
      },
      {
        id: 'tc-csv-2',
        name: 'Test 2: Moderate threshold (>= 50000)',
        input: '50000\n',
        expectedOutput: 'COUNT: 5 | AVG_RATING: 4.52\n',
        explanation: 'Bob, Diana, Evan, George, Hannah',
      },
      {
        id: 'tc-csv-3',
        name: 'Test 3: Unreachable threshold (>= 100000)',
        input: '100000\n',
        expectedOutput: 'COUNT: 0 | AVG_RATING: 0.00\n',
        explanation: 'No employee has >= 100000 sales',
      },
    ],
  },
  {
    id: 'matrix-multi-file',
    title: 'Matrix Multiplier (Multi-File Module)',
    difficulty: 'Medium',
    category: 'Multi-File Architecture',
    description: `Tests multi-file submission as defined in \`image.png\` ("app/main... Добавочные файлы, среди которых обязательно должен быть какой-то main").

The submission includes two files:
1. \`matrix_utils.py\` (Helper module implementing matrix multiplication and dot product)
2. \`main.py\` (Entry point importing \`matrix_utils\` and reading input matrices from stdin)`,
    inputFormat: `Line 1: Dimensions of matrix A (R1 C1)
Next R1 lines: C1 integers per line
Next line: Dimensions of matrix B (R2 C2, where R2 == C1)
Next R2 lines: C2 integers per line`,
    outputFormat: `R1 lines with C2 space-separated integers representing matrix product A x B`,
    constraints: [
      '1 <= R1, C1, R2, C2 <= 100',
      'C1 == R2',
      '-100 <= elements <= 100',
    ],
    timeLimitSec: 2.0,
    memoryLimitMb: 256,
    allowedLanguages: ['python'],
    defaultFiles: {
      python: [
        {
          id: 'mat-main',
          name: 'main.py',
          isMain: true,
          content: `import sys
from matrix_utils import multiply_matrices

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    idx = 0
    r1, c1 = int(tokens[idx]), int(tokens[idx+1])
    idx += 2
    
    A = []
    for _ in range(r1):
        row = [int(x) for x in tokens[idx:idx+c1]]
        idx += c1
        A.append(row)
        
    r2, c2 = int(tokens[idx]), int(tokens[idx+1])
    idx += 2
    
    B = []
    for _ in range(r2):
        row = [int(x) for x in tokens[idx:idx+c2]]
        idx += c2
        B.append(row)
        
    result = multiply_matrices(A, B)
    for row in result:
        print(" ".join(str(x) for x in row))

if __name__ == '__main__':
    solve()
`,
        },
        {
          id: 'mat-utils',
          name: 'matrix_utils.py',
          isMain: false,
          content: `def multiply_matrices(A, B):
    """Multiplies matrix A (r1 x c1) by matrix B (r2 x c2)"""
    r1 = len(A)
    c1 = len(A[0])
    r2 = len(B)
    c2 = len(B[0])
    
    assert c1 == r2, f"Dimension mismatch: {c1} != {r2}"
    
    result = [[0] * c2 for _ in range(r1)]
    for i in range(r1):
        for k in range(c1):
            if A[i][k] != 0:
                for j in range(c2):
                    result[i][j] += A[i][k] * B[k][j]
    return result
`,
        },
      ],
      cpp: [],
      java: [],
    },
    testCases: [
      {
        id: 'tc-mat-1',
        name: 'Sample 1: 2x2 Square Matrices',
        input: '2 2\n1 2\n3 4\n2 2\n5 6\n7 8\n',
        expectedOutput: '19 22\n43 50\n',
        explanation: '[[1*5+2*7, 1*6+2*8], [3*5+4*7, 3*6+4*8]] = [[19, 22], [43, 50]]',
      },
      {
        id: 'tc-mat-2',
        name: 'Sample 2: Rectangular Matrices 2x3 and 3x1',
        input: '2 3\n1 2 3\n4 5 6\n3 1\n2\n3\n4\n',
        expectedOutput: '20\n47\n',
        explanation: '[[1*2+2*3+3*4], [4*2+5*3+6*4]] = [[20], [47]]',
      },
    ],
  },
  {
    id: 'fibonacci-modulo',
    title: 'Fibonacci Sequence Modulo 10^9+7',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    description: `Compute the N-th Fibonacci number modulo 1,000,000,007.
F(0) = 0
F(1) = 1
F(N) = F(N-1) + F(N-2) for N >= 2.

Ensure your algorithm completes within the 2.0s time limit (TLE protection).`,
    inputFormat: `A single integer N`,
    outputFormat: `F(N) % 1000000007`,
    constraints: ['0 <= N <= 10^7'],
    timeLimitSec: 2.0,
    memoryLimitMb: 256,
    allowedLanguages: ['python', 'cpp', 'java'],
    defaultFiles: {
      python: [
        {
          id: 'fib-py-main',
          name: 'main.py',
          isMain: true,
          content: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    MOD = 1_000_000_007

    if n == 0:
        print(0)
        return
    if n == 1:
        print(1)
        return

    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, (a + b) % MOD

    print(b)

if __name__ == '__main__':
    solve()
`,
        },
      ],
      cpp: [
        {
          id: 'fib-cpp-main',
          name: 'main.cpp',
          isMain: true,
          content: `#include <iostream>

using namespace std;

int main() {
    long long n;
    if (!(cin >> n)) return 0;

    const long long MOD = 1000000007;
    if (n == 0) { cout << 0 << "\\n"; return 0; }
    if (n == 1) { cout << 1 << "\\n"; return 0; }

    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long long next = (a + b) % MOD;
        a = b;
        b = next;
    }

    cout << b << "\\n";
    return 0;
}
`,
        },
      ],
      java: [
        {
          id: 'fib-java-main',
          name: 'Main.java',
          isMain: true,
          content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextLong()) return;
        long n = scanner.nextLong();
        long MOD = 1000000007L;

        if (n == 0) { System.out.println(0); return; }
        if (n == 1) { System.out.println(1); return; }

        long a = 0, b = 1;
        for (long i = 2; i <= n; i++) {
            long next = (a + b) % MOD;
            a = b;
            b = next;
        }

        System.out.println(b);
    }
}
`,
        },
      ],
    },
    testCases: [
      {
        id: 'tc-fib-1',
        name: 'Base case: N=0',
        input: '0\n',
        expectedOutput: '0\n',
      },
      {
        id: 'tc-fib-2',
        name: 'Base case: N=10',
        input: '10\n',
        expectedOutput: '55\n',
      },
      {
        id: 'tc-fib-3',
        name: 'Medium: N=50',
        input: '50\n',
        expectedOutput: '586268941\n',
      },
      {
        id: 'tc-fib-4',
        name: 'Hidden: N=100000',
        input: '100000\n',
        expectedOutput: '702434079\n',
        isHidden: true,
      },
    ],
  },
];
