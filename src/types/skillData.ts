// --- 言語に応じたデフォルトコードを返すヘルパー関数 (HTML/CSSを追加) ---
export const getDefaultCode = (lang: string): string => {
  switch (lang) {
    case "javascript":
      return `function solution(input) {
  // ここにJavaScriptコードを書いてください
  
  return "";
}`;
    case "typescript":
      return `function solution(input: any): any {
  // ここにTypeScriptコードを書いてください
  
  return "";
}`;
    case "python":
      return `def solution(input):
  # ここにPythonコードを書いてください
  
  return ""
`;
    case "java":
      return `public class Solution {
    public Object solution(Object input) {
        // ここにJavaコードを書いてください
        
        return null;
    }
}`;
    case "ruby":
      return `def solution(input)
  # ここにRubyコードを書いてください
  
  return ""
end
`;
    case "html":
      return `<!DOCTYPE html>
<html>
<head>
  <title>プレビュー</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 20px;
      padding: 0;
      background-color: #f0f0f0;
    }
    h1 {
      color: #333;
    }
    .box {
      width: 100px;
      height: 100px;
      background-color: skyblue;
      border: 1px solid steelblue;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Hello, HTML!</h1>
  <p>ここにあなたのHTMLコードを書いてください。</p>
  <div class="box"></div>
</body>
</html>`;
    case "css":
      return `/* ここにCSSコードを書いてください */
body {
  background-color: #e6ffe6; /* 薄い緑色の背景 */
  color: #004d00; /* 濃い緑色の文字 */
}

h1 {
  text-decoration: underline;
  color: #006400; /* より濃い緑色 */
}

.box {
  width: 100px;
  height: 100px;
  background-color: #fffacd; /* レモン色の背景 */
  border: 2px dashed #ff4500; /* オレンジ色の破線 */
}
`;
    default:
      return `// 未知の言語です。ここにコードを書いてください。`;
  }
};