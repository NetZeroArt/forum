# 新媒體藝術 × 淨零未來｜藝術永續論壇 2026 官網

> 2026 年 5 月 3 日（週日）13:00–18:10  
> 金車文藝中心 臺北承德館

單頁式活動官網，純前端、無需 build，直接部署到 GitHub Pages 即可上線。

---

## 檔案結構

```
zero-art-forum/
├── index.html                  主頁（所有內容）
├── css/style.css               樣式（淺色主題 + 永續綠強調色）
├── js/main.js                  動態效果（GSAP + Lenis）
├── assets/
│   ├── video/
│   │   ├── banner-desktop.mp4  桌機橫式 banner（2:1，H.264）
│   │   ├── banner-desktop.webm 桌機橫式 banner（2:1，VP9）
│   │   ├── banner-mobile.mp4   手機直式 banner（5:7，球體在上/文字在下）
│   │   ├── banner-mobile.webm  手機直式 banner（VP9）
│   │   └── banner-poster.jpg   影片封面（載入中顯示，同時作為 OG image）
│   └── images/
│       ├── hero/               首屏主視覺備份（a1-1, a1-2）
│       ├── speakers/           8 位講者照片
│       └── posts/              FB 貼文圖
└── README.md
```

---

## 動態效果亮點

- **Hero 橫式 banner 影片**（mp4 + webm 雙格式，文字已設計進影片）：桌機載入 2:1 寬版（球體左、文字右），手機自動切換為 5:7 直式版（球體上、文字下），無需額外 SVG 文字層。
- **白底消融**：`mix-blend-mode: multiply` 讓影片白底與淺色頁面自然融合，無明顯邊框。
- **氛圍光環**：球體後方漸層光暈呼吸脈動，桌機版偏左對齊球體中心。
- **滑鼠視差**：banner 輕微跟隨游標位移，產生景深。
- **滾動視差**：離開首屏時 banner 下飄並淡出。
- **Lenis 絲滑滾動**：全站絲滑慣性滾動。
- **GSAP ScrollTrigger 進場動畫**：所有元素滾動觸發淡入上滑。
- **數字遞增**：統計數字滾動到時動態計數。
- **自訂游標**：黑白混合模式圓環 + 點。
- **卡片 3D 傾斜**：三大場次卡片滑鼠追蹤 3D hover。
- **頂部滾動進度條**：漸層色由綠轉橘。
- **導覽列自動切換**：離開 Hero 後切為毛玻璃狀態。
- **無障礙**：`prefers-reduced-motion` 使用者會自動停用動畫，影片改顯示靜態海報。

---

## 本機預覽

直接用瀏覽器打開 `index.html` 即可。若遇到字型或跨域問題，建議啟動一個簡單伺服器：

```bash
# Python 3
python -m http.server 5500

# Node.js
npx serve .
```

然後開啟 http://localhost:5500

---

## 部署到 GitHub Pages（推薦方式）

### 方法 A：透過 GitHub 網頁介面（最簡單，0 指令）

1. 登入 [GitHub](https://github.com) → 點右上角 **+** → **New repository**。
2. Repository name 填 `zero-art-forum`（或任何喜歡的名字）。
3. 選 **Public**，勾選 **Add a README file**（之後會被覆蓋），按 **Create**。
4. 進入 repo 後點 **Add file** → **Upload files**。
5. 把 `zero-art-forum/` 資料夾內的**所有檔案和子資料夾**拖進去（注意：要把資料夾內容上傳，而不是整個資料夾本身）。
6. 往下滾，按 **Commit changes**。
7. 切到 **Settings** → 左側 **Pages**。
8. **Source** 選 `Deploy from a branch`，**Branch** 選 `main` 和 `/ (root)`，按 **Save**。
9. 等 1–2 分鐘，頁面會顯示你的網址：  
   `https://你的帳號.github.io/zero-art-forum/`

### 方法 B：透過 Git 指令（習慣用終端機者）

```bash
# 在 zero-art-forum/ 資料夾內
git init
git add .
git commit -m "Initial commit: 淨零論壇官網"

# 到 GitHub 新增一個空 repo（不要勾 README），然後：
git branch -M main
git remote add origin https://github.com/你的帳號/zero-art-forum.git
git push -u origin main
```

然後回到 GitHub 網頁 → **Settings → Pages** → Source 選 `main` / `root` → Save。

---

## 更新內容

- **改文字**：編輯 `index.html`。
- **改顏色**：編輯 `css/style.css` 最上方的 `:root` CSS 變數區塊。
- **換講者照片**：替換 `assets/images/speakers/` 內同名檔案即可。
- **換主視覺**：`assets/images/hero/` 內的圖片（目前首屏用粒子背景，圖片為備用）。

---

## 自訂網域（選擇性）

若有買網域（例如 `netzero-art.tw`）：

1. 在網域商後台新增 CNAME 指向 `你的帳號.github.io`。
2. 在 repo 根目錄新增 `CNAME` 檔，內容填 `netzero-art.tw`。
3. GitHub Pages Settings → Custom domain 填入網域，勾選 Enforce HTTPS。

---

## 報名連結

[👉 前往 Accupass 報名](https://www.accupass.com/event/2604180337011625846411?utm_source=web&utm_medium=search_result_%E7%B6%93%E7%87%9F%E8%87%AA%E5%AA%92%E9%AB%94&utm_campaign=accu_e_)

---

## 授權

活動資料版權屬主辦單位（金車文藝中心・凡事設計）所有。
