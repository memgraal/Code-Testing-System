import { LanguageId, LanguageSpec } from '../types';

export const PYTHON_DOCKERFILE = `FROM python:3.11-slim

RUN useradd -m runner
WORKDIR /sandbox
USER runner

CMD ["sleep", "infinity"]`;

export const CPP_DOCKERFILE = `FROM debian:bookworm-slim

RUN apt-get update && \\
    apt-get install -y --no-install-recommends g++ && \\
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd -m runner
WORKDIR /sandbox
USER runner

CMD ["sleep", "infinity"]`;

export const JAVA_DOCKERFILE = `FROM openjdk:17-slim

RUN useradd -m runner
WORKDIR /sandbox
USER runner

CMD ["sleep", "infinity"]`;

export const SUPPORTED_LANGUAGES: Record<LanguageId, LanguageSpec> = {
  python: {
    id: 'python',
    name: 'Python 3',
    version: '3.11',
    entryFile: 'main.py',
    compileCmd: null,
    runCmd: 'python3 main.py',
    dockerImage: 'judge-python',
    dockerfile: PYTHON_DOCKERFILE,
    boilerplate: `import sys

def solve():
    # Read all input from standard input
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    # Process problem logic here
    print("Hello from Python")

if __name__ == '__main__':
    solve()
`,
  },
  cpp: {
    id: 'cpp',
    name: 'C++ 20',
    version: 'GCC 12 / C++20',
    entryFile: 'main.cpp',
    compileCmd: 'g++ main.cpp -O2 -o main',
    runCmd: './main',
    dockerImage: 'judge-cpp',
    dockerfile: CPP_DOCKERFILE,
    boilerplate: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read input and process
    return 0;
}
`,
  },
  java: {
    id: 'java',
    name: 'Java 17',
    version: 'OpenJDK 17',
    entryFile: 'Main.java',
    compileCmd: 'javac Main.java',
    runCmd: 'java Main',
    dockerImage: 'judge-java',
    dockerfile: JAVA_DOCKERFILE,
    boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Solution logic here
        
        scanner.close();
    }
}
`,
  },
};
