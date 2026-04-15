# HYTool - 个人工具箱（本地工具站）

HYTool 是一个聚合常用效率工具的个人网站，主打：纯前端、本地处理、即开即用。

## 功能概览

### 图片工具
- 图片格式转换（PNG / JPG / WEBP）
- 二维码生成（可自定义颜色、容错率）

### 文档与数据
- JSON 格式化 / 压缩 / 校验
- JSON 转 Excel（.xlsx）
- Excel / CSV 转 JSON

### 开发者工具
- Base64 编解码
- Hash 生成器（SHA-1 / SHA-256 / SHA-384 / SHA-512）
- 单位换算（长度 / 重量 / 温度）
- 时间戳转换（Unix 时间戳 ↔ 自然时间）

### AI 工具
- Claude 终端命令速查（CLI 命令、启动参数、REPL 斜杠命令）

## 技术栈
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand（主题、近期使用等本地状态）

## 本地运行

```bash
npm install
npm run dev
```

打开终端输出的地址（通常为 http://localhost:5173/）。

## 构建

```bash
npm run build
npm run preview
```

## 隐私说明
- 本项目大多数工具均为浏览器本地处理，不会上传文件到服务器。
- “本地处理”能力取决于浏览器限制与所用工具实现（例如文档转换类功能可能需要额外引擎支持）。
