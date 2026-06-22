require("dotenv").config();

const http = require("http");
const fs = require("fs");
const axios = require("axios");

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/chat/completions";

const server = http.createServer((request, response) => {
  // 首页
  if (request.method === "GET" && request.url === "/") {
    fs.readFile("index.html", (err, data) => {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("读取页面失败");
        return;
      }

      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });
      response.end(data);
    });

    return;
  }

  // AI 对话接口
  if (request.method === "POST" && request.url === "/chat") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      try {
        const data = JSON.parse(body);

        // 读取知识库
        const knowledge = fs.readFileSync("company.txt", "utf8");

        // 构造 Prompt
        const prompt = `
你是一名企业培训讲师，请生成一段标准化培训讲稿。

要求：
1. 语言口语化，但不要过于聊天
2. 结构清晰：开场 → 核心步骤（3-5点） → 总结
3. 每一部分要有逻辑，不要发散
4. 控制长度在1分钟口播内容
5. 不要出现无关公司信息（如作息时间）

【企业知识】
${knowledge}

【培训主题】
${data.question}
`;

        // 调用 DeepSeek
        const result = await axios.post(
          API_URL,
          {
            model: "deepseek-chat",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const answer = result.data.choices[0].message.content;

        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });

        response.end(
          JSON.stringify({
            answer: answer,
          }),
        );
      } catch (error) {
        console.error(error.response?.data || error);

        response.writeHead(500, {
          "Content-Type": "application/json; charset=utf-8",
        });

        response.end(
          JSON.stringify({
            answer: "调用失败，请检查 API Key、网络或模型配置。",
          }),
        );
      }
    });

    return;
  }

  // 404
  response.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end("404 Not Found");
});

server.listen(3000, () => {
  console.log("服务器已启动：http://localhost:3000");
});
