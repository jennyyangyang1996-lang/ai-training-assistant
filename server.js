const path = require("path");
require("dotenv").config();

const http = require("http");
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/chat/completions";

const AUDIO_DIR = path.join(__dirname, "audio");

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR);
}

function runEdgeTTS(inputTextPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    const command = `edge-tts --file "${inputTextPath}" --voice zh-CN-XiaoxiaoNeural --write-media "${outputAudioPath}"`;

    exec(
      command,
      { windowsHide: true, timeout: 120000 },
      (error, stdout, stderr) => {
        if (error) {
          console.log("语音生成失败：", stderr || error.message);
          reject(error);
          return;
        }

        if (!fs.existsSync(outputAudioPath)) {
          reject(new Error("edge-tts 执行完成，但音频文件未生成"));
          return;
        }

        const stat = fs.statSync(outputAudioPath);
        if (stat.size === 0) {
          reject(new Error("音频文件为空"));
          return;
        }

        console.log("语音生成成功：", outputAudioPath);
        resolve();
      },
    );
  });
}

const server = http.createServer((request, response) => {
  // ================= 首页 =================
  if (request.method === "GET" && request.url === "/") {
    fs.readFile("index.html", (err, data) => {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("index load failed");
        return;
      }

      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });

      response.end(data);
    });

    return;
  }

  // ================= 音频文件 =================
  if (request.method === "GET" && request.url.startsWith("/audio/")) {
    const fileName = path.basename(
      decodeURIComponent(request.url.replace("/audio/", "")),
    );
    const filePath = path.join(AUDIO_DIR, fileName);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        response.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("audio not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      });

      response.end(data);
    });

    return;
  }

  // ================= AI接口 =================
  if (request.method === "POST" && request.url === "/chat") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      try {
        const data = JSON.parse(body);

        const knowledge = fs.readFileSync("company.txt", "utf8");

        const prompt = `
你是一名企业培训讲师，请生成一段标准化培训讲稿。

要求：
1. 语言口语化，但不要过于聊天
2. 结构清晰：开场 → 核心步骤（3-5点） → 总结
3. 每一部分要有逻辑，不要发散
4. 控制长度在1分钟口播内容
5. 不要出现无关公司信息

【企业知识】
${knowledge}

【培训主题】
${data.question}
`;

        const result = await axios.post(
          API_URL,
          {
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const answer = result.data.choices[0].message.content;

        const timestamp = Date.now();
        const textFileName = `tts-${timestamp}.txt`;
        const audioFileName = `training-${timestamp}.mp3`;

        const textFilePath = path.join(AUDIO_DIR, textFileName);
        const audioFilePath = path.join(AUDIO_DIR, audioFileName);

        fs.writeFileSync(textFilePath, answer, "utf8");

        await runEdgeTTS(textFilePath, audioFilePath);

        if (fs.existsSync(textFilePath)) {
          fs.unlinkSync(textFilePath);
        }

        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });

        response.end(
          JSON.stringify({
            answer,
            audioUrl: `/audio/${audioFileName}`,
          }),
        );
      } catch (error) {
        console.log(
          "系统错误：",
          error.response?.data || error.message || error,
        );

        response.writeHead(500, {
          "Content-Type": "application/json; charset=utf-8",
        });

        response.end(
          JSON.stringify({
            answer: "系统错误，请检查 API、edge-tts 或网络配置。",
          }),
        );
      }
    });

    return;
  }

  // ================= 404 =================
  response.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end("404 Not Found");
});

server.listen(3000, () => {
  console.log("服务器已启动：http://localhost:3000");
});
