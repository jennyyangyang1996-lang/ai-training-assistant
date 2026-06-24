# AI企业培训助手 V3（语音讲解版）

## 📌 项目简介

AI企业培训助手 V3 是一个基于 **Node.js + DeepSeek API + Prompt Engineering + edge-tts** 构建的轻量级 AI 应用。

本项目从 V1 的“企业制度问答”，升级到 V2 的“培训讲稿生成”，再进一步升级为 V3 的“培训讲稿 + 语音讲解”。

用户输入一个企业培训主题后，系统会自动读取企业知识库内容，调用 DeepSeek API 生成标准化培训讲稿，并通过 edge-tts 将讲稿转换为语音文件，最终在网页端展示讲稿并支持播放语音。

---

## 🎯 项目目标

将企业内部制度、流程说明、培训资料等内容，通过 AI 自动转换为：

- 结构清晰的培训讲稿
- 适合口播的新员工培训内容
- 可播放的语音讲解
- 可复用的企业培训素材

用于提升企业内部培训效率，减少重复讲解成本，并探索 AI 在企业培训场景中的实际落地价值。

---

## 🧠 核心能力

- 输入培训主题，例如：报销流程、请假制度、试用期规则
- 自动读取本地企业知识库 `company.txt`
- 基于 Prompt Engineering 生成结构化培训讲稿
- 调用 DeepSeek API 完成内容生成
- 使用 edge-tts 将讲稿转换为语音
- 后端生成唯一语音文件，避免音频覆盖和缓存问题
- 前端展示讲稿，并支持用户点击播放语音

---

## 🏗️ 技术栈

- Node.js：后端服务
- HTTP 原生模块：搭建本地服务
- Axios：调用 DeepSeek API
- dotenv：管理环境变量
- DeepSeek API：大模型内容生成能力
- Prompt Engineering：控制讲稿结构、语气和输出格式
- edge-tts：文本转语音
- HTML / JavaScript：前端页面与交互
- company.txt：本地企业知识库

---

## 🔄 系统流程

```text
用户输入培训主题
↓
index.html 前端页面提交请求
↓
server.js 后端接收请求
↓
读取企业知识库 company.txt
↓
构建 Prompt（角色 + 规则 + 企业知识 + 用户主题）
↓
调用 DeepSeek API
↓
生成标准化培训讲稿
↓
调用 edge-tts
↓
将讲稿转换为 mp3 语音文件
↓
保存到 audio/ 文件夹
↓
后端返回讲稿内容 answer 和语音地址 audioUrl
↓
前端展示讲稿
↓
用户点击“播放语音”
↓
播放 AI 生成的培训语音
```

---

## ✨ Prompt 设计（核心）

```text
你是一名企业培训讲师，请生成一段标准化培训讲稿。

要求：
1. 语言口语化，但不要过于聊天
2. 结构清晰：开场 → 核心步骤（3-5点） → 总结
3. 每一部分要有逻辑，不要发散
4. 控制长度在1分钟口播内容
5. 不要出现无关公司信息

【企业知识】
{{knowledge}}

【培训主题】
{{topic}}
```

---

## 📌 示例

### 输入：

```text
报销流程
```

### 输出：

```text
各位同事大家好，今天我们来讲解一下公司的报销流程。

首先，大家在产生报销事项后，需要准备好对应的发票和相关凭证。
第二步，按照公司要求提交报销申请，并确保填写的信息准确完整。
第三步，财务会在规定时间内进行审核，审核通过后完成报销处理。

总结一下，报销的关键是资料完整、流程规范、及时提交。这样可以减少反复沟通，提高整体处理效率。
```

### 语音输出：

系统会将上述培训讲稿转换为 mp3 语音文件，并在网页端支持播放。

---

## 🚀 项目版本演进

| 版本 | 功能         | 说明                                                       |
| ---- | ------------ | ---------------------------------------------------------- |
| V1   | 企业制度问答 | 基于 company.txt 和 DeepSeek API 实现企业知识问答          |
| V2   | 培训讲稿生成 | 从“问答型 AI”升级为“内容生成型 AI”，支持生成标准化培训讲稿 |
| V3   | 语音讲解     | 增加 edge-tts 语音生成能力，实现“讲稿 → 语音播放”闭环      |

---

## 🧠 项目亮点

- 从“AI 问答”升级为“AI 内容生成”
- 从“文本输出”升级为“文本 + 语音输出”
- 使用本地企业知识库约束 AI 输出内容
- 通过 Prompt Engineering 控制讲稿结构和表达风格
- 使用 edge-tts 生成自然语音，提升培训内容的可用性
- 采用唯一音频文件名，解决音频覆盖、缓存和播放状态异常问题
- 轻量级实现，无复杂框架，适合作为 AI 应用 MVP 作品

---

## 📂 项目结构

```text
ai-training-assistant-v3/
│
├── server.js              # Node.js 后端服务
├── index.html             # 前端页面
├── company.txt            # 企业知识库示例
├── package.json           # Node.js 项目配置
├── package-lock.json      # Node.js 依赖锁定文件
├── requirements.txt       # Python 依赖说明
├── .env.example           # 环境变量示例
├── .gitignore             # Git 忽略配置
│
└── audio/                 # 运行时生成的语音文件，不上传 GitHub
```

---

## ⚙️ 环境准备

本项目需要同时准备 Node.js 和 Python 环境。

### 1. 安装 Node.js 依赖

```bash
npm install
```

### 2. 安装 Python 语音依赖

```bash
pip install -r requirements.txt
```

如果没有使用 `requirements.txt`，也可以直接执行：

```bash
pip install edge-tts
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

然后在 `.env` 文件中填入自己的 DeepSeek API Key：

```bash
DEEPSEEK_API_KEY=你的真实DeepSeek_API_Key
```

注意：`.env` 文件不要上传 GitHub。

---

## 📂 运行方式

启动项目：

```bash
npm start
```

或直接运行：

```bash
node server.js
```

浏览器访问：

```text
http://localhost:3000
```

---

## 🔊 V3 语音播放机制说明

V3 版本对语音播放流程做了稳定性优化。

之前如果反复覆盖同一个 `output.mp3`，可能出现：

- 浏览器缓存旧音频
- 前端读取到未完全生成的音频
- 播放按钮短暂进入播放状态后又变灰
- 自动播放被浏览器拦截

因此 V3 改为：

```text
每次生成唯一 mp3 文件
↓
后端确认音频生成完成
↓
返回 audioUrl
↓
前端加载音频
↓
用户点击播放语音
```

这种方式更稳定，也更符合浏览器的音频播放规则。

---

## 🔐 GitHub 上传说明

以下文件应该上传：

```text
server.js
index.html
company.txt
package.json
package-lock.json
requirements.txt
.env.example
.gitignore
README.md
```

以下文件不要上传：

```text
.env
node_modules/
audio/
*.mp3
*.wav
```

---

## 🎯 作者目标

本项目是个人 OPC 实践项目的一部分，目标是探索：

> 如何用 AI 构建可独立运行的微型产品 MVP，并验证真实业务场景价值。

通过该项目，重点训练以下能力：

- AI 应用产品设计
- Prompt Engineering
- 前后端基础交互
- 大模型 API 调用
- 文本转语音能力集成
- AI 产品从 V1 到 V3 的迭代思维
- 面向真实企业场景的 MVP 构建能力

---

## 📌 下一步计划（V4）

V3 已完成“培训讲稿 + 语音讲解”闭环。

下一步 V4 计划向 AI 数字人方向演进：

- 增加数字人形象
- 实现讲稿语音驱动数字人讲解
- 生成培训讲解视频
- 探索企业培训数字人应用场景

---
