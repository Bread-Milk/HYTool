import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ImageConverter from "@/pages/tools/ImageConverter";
import DocumentConverter from "@/pages/tools/DocumentConverter";
import JsonFormatter from "@/pages/tools/JsonFormatter";
import JsonToExcel from "@/pages/tools/JsonToExcel";
import ExcelToJson from "@/pages/tools/ExcelToJson";
import TimestampConverter from "@/pages/tools/TimestampConverter";
import Base64Codec from "@/pages/tools/Base64Codec";
import WordCounter from "@/pages/tools/WordCounter";
import QrCodeGenerator from "@/pages/tools/QrCodeGenerator";
import HashGenerator from "@/pages/tools/HashGenerator";
import UnitConverter from "@/pages/tools/UnitConverter";
import ClaudeCommands from "@/pages/tools/ClaudeCommands";
import Layout from "@/components/layout/Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recent" element={<Home />} />
          <Route path="popular" element={<Home />} />
          <Route path="cat/:category" element={<Home />} />
          <Route path="tools/image-converter" element={<ImageConverter />} />
          <Route path="tools/document-converter" element={<DocumentConverter />} />
          <Route path="tools/json-formatter" element={<JsonFormatter />} />
          <Route path="tools/json-to-excel" element={<JsonToExcel />} />
          <Route path="tools/excel-to-json" element={<ExcelToJson />} />
          <Route path="tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="tools/base64-codec" element={<Base64Codec />} />
          <Route path="tools/word-counter" element={<WordCounter />} />
          <Route path="tools/qrcode-generator" element={<QrCodeGenerator />} />
          <Route path="tools/hash-generator" element={<HashGenerator />} />
          <Route path="tools/unit-converter" element={<UnitConverter />} />
          <Route path="tools/claude-commands" element={<ClaudeCommands />} />
          {/* Other tools placeholder */}
          <Route path="tools/*" element={
            <div className="flex h-full items-center justify-center text-zinc-500">
              该工具仍在开发中，敬请期待...
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}
