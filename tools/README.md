# tools

## build_ai_fonts.py
AI 加值頁（ai/）專用字型 `ai/fonts-noto.css` 只含本頁用到的字。
**修改 ai/index.html 加了新的中文字後，要重跑一次**，否則新字會用系統字型顯示：

```
npm pack @fontsource/noto-sans-tc && mkdir x && tar -xzf fontsource-noto-sans-tc-*.tgz -C x
python3 -I tools/build_ai_fonts.py x/package/files ai/index.html ai/fonts-noto.css
```
然後把 ai/index.html 裡 `fonts-noto.css?v=` 的數字加 1。
