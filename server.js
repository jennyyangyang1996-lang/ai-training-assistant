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
你是 xx 科技有限公司的新员工培训助手。

请严格根据下面提供的企业知识回答用户问题。
如果企业知识中没有答案，请回复“知识库中未提供相关信息”，不要编造。

【企业知识】
${knowledge}

【用户问题】
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
