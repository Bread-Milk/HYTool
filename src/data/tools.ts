import {
  Image,
  FileText,
  Code,
  Type,
  FileJson,
  Hash,
  Calculator,
  QrCode,
  Bot,
  Clock,
  DollarSign
} from 'lucide-react';

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  category: 'image' | 'document' | 'developer' | 'text' | 'ai';
  icon: any;
  path: string;
  isPopular?: boolean;
}

export const tools: ToolInfo[] = [
  {
    id: 'image-converter',
    name: '图片格式转换',
    description: '在本地快速将图片转换为 PNG, JPG, WEBP 等格式，支持批量。',
    category: 'image',
    icon: Image,
    path: '/tools/image-converter',
    isPopular: true,
  },
  {
    id: 'document-converter',
    name: '文档格式转换',
    description: '在 PDF、Word、Excel 等文档格式之间进行转换。',
    category: 'document',
    icon: FileText,
    path: '/tools/document-converter',
    isPopular: true,
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、压缩、验证 JSON 字符串，支持错误高亮。',
    category: 'developer',
    icon: FileJson,
    path: '/tools/json-formatter',
  },
  {
    id: 'json-to-excel',
    name: 'JSON 转 Excel',
    description: '将 JSON 数组数据转换为 Excel 表格文件 (.xlsx)。',
    category: 'developer',
    icon: FileJson,
    path: '/tools/json-to-excel',
  },
  {
    id: 'excel-to-json',
    name: 'Excel 转 JSON',
    description: '将 Excel 或 CSV 文件解析并转换为 JSON 格式数据。',
    category: 'developer',
    icon: FileJson,
    path: '/tools/excel-to-json',
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '在 Unix 时间戳与自然时间格式之间进行精准的双向转换。',
    category: 'developer',
    icon: Clock,
    path: '/tools/timestamp-converter',
  },
  {
    id: 'salary-tracker',
    name: '工资显示器',
    description: '实时显示今天已赚工资，支持月薪、工作天数与税后自动换算。',
    category: 'developer',
    icon: DollarSign,
    path: '/tools/salary-tracker',
    isPopular: true,
  },
  {
    id: 'base64-codec',
    name: 'Base64 编解码',
    description: '将文本或文件转换为 Base64 字符串，或反向解码。',
    category: 'developer',
    icon: Code,
    path: '/tools/base64-codec',
  },
  {
    id: 'hash-generator',
    name: 'Hash 生成器',
    description: '计算文本或文件的 MD5, SHA-1, SHA-256 等哈希值。',
    category: 'developer',
    icon: Hash,
    path: '/tools/hash-generator',
  },
  {
    id: 'word-counter',
    name: '字数统计',
    description: '统计中英文字符数、单词数、行数及阅读时间。',
    category: 'text',
    icon: Type,
    path: '/tools/word-counter',
  },
  {
    id: 'unit-converter',
    name: '单位换算',
    description: '长度、重量、温度、时间等常用物理单位换算。',
    category: 'text',
    icon: Calculator,
    path: '/tools/unit-converter',
  },
  {
    id: 'qrcode-generator',
    name: '二维码生成器',
    description: '将文本或链接转换为二维码图片，支持自定义颜色。',
    category: 'image',
    icon: QrCode,
    path: '/tools/qrcode-generator',
  },
  {
    id: 'claude-commands',
    name: 'Claude 终端命令',
    description: '收录和查询 Claude Code/CLI 等常用的终端命令行工具指令与参数速查。',
    category: 'ai',
    icon: Bot,
    path: '/tools/claude-commands',
    isPopular: true,
  },
];
