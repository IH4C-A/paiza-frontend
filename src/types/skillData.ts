export const getDefaultCode = (lang: string): string => {
  switch (lang.toLowerCase()) {
    case "javascript":
      return `function solution(input) {
  // JavaScriptコードをここに記述
  return "";
}`;
    case "typescript":
      return `function solution(input: any): any {
  // TypeScriptコードをここに記述
  return "";
}`;
    case "python":
    case "python3":
      return `def solution(input):
  # Pythonコードをここに記述
  return ""`;
    case "java":
      return `public class Solution {
  public static Object solution(Object input) {
    // Javaコードをここに記述
    return null;
  }
}`;
    case "php":
      return `<?php
function solution($input) {
  // PHPコードをここに記述
  return "";
}`;
    case "ruby":
      return `def solution(input)
  # Rubyコードをここに記述
  return ""
end`;
    case "c":
      return `#include <stdio.h>

void solution(char* input) {
  // Cコードをここに記述
  printf("%s", input);
}`;
    case "c++":
      return `#include <iostream>
using namespace std;

void solution(string input) {
  // C++コードをここに記述
  cout << input << endl;
}`;
    case "c#":
    case "csharp":
      return `using System;

class Program {
  public static string Solution(string input) {
    // C#コードをここに記述
    return "";
  }
}`;
    case "go":
      return `package main
import "fmt"

func solution(input string) string {
  // Goコードをここに記述
  return ""
}`;
    case "swift":
      return `func solution(_ input: String) -> String {
  // Swiftコードをここに記述
  return ""
}`;
    case "rust":
      return `fn solution(input: &str) -> String {
  // Rustコードをここに記述
  input.to_string()
}`;
    case "dart":
      return `String solution(String input) {
  // Dartコードをここに記述
  return "";
}`;
    case "bash":
      return `#!/bin/bash
# Bashコードをここに記述
echo "$1"`;
    case "html":
      return `<!DOCTYPE html>
<html>
<head>
  <title>プレビュー</title>
  <style>
    body {
      font-family: sans-serif;
      background-color: #f0f0f0;
      padding: 20px;
    }
  </style>
</head>
<body>
  <h1>Hello, HTML!</h1>
</body>
</html>`;
    case "css":
      return `/* CSSコードをここに記述 */
body {
  background-color: #f5f5f5;
  color: #333;
}`;
    case "sql":
      return `-- SQLクエリをここに記述
SELECT * FROM users;`;
    case "r":
      return `solution <- function(input) {
  # Rコードをここに記述
  return(input)
}`;
    case "vb":
    case "visual basic":
      return `Function Solution(ByVal input As String) As String
  ' Visual Basicコードをここに記述
  Return input
End Function`;
    case "assembly":
      return `; Assemblyコードをここに記述
section .data
  msg db "Hello, Assembly!",0Ah
section .text
  global _start
_start:
  ; 実装省略`;
    case "applescript":
      return `-- AppleScriptコードをここに記述
display dialog "Hello, AppleScript!"`;
    case "google apps script":
      return `function solution(input) {
  // Google Apps Scriptコードをここに記述
  return input;
}`;
    case "kotlin":
      return `fun solution(input: String): String {
  // Kotlinコードをここに記述
  return ""
}`;
    default:
      return `// 未知の言語です。ここにコードを記述してください。`;
  }
};
