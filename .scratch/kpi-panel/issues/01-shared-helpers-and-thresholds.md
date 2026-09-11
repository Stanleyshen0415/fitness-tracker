# 01 — 共用 helper 與門檻常數（prefactor）

**Parent:** PRD.md（六週 KPI 面板）

**What to build:** 把「必做帳」的規則收成一套共用函式，讓之後的週曆條、累計磚、保險絲都算同一本帳；並把定稿的四個門檻數字集中成一個常數物件。使用者看不到任何畫面變化，但 weekDone 的行為必須完全不變。

**Blocked by:** None — can start immediately

**Status:** resolved

> 註：週函式＝既有 `weekDone(mon)`，本來就是「輸入週一 → {n, minUsed}」，再包一層是 Middle Man，故不另建；後續票「呼叫 01 的週函式」即呼叫 weekDone。日層判定抽為 `mustDone(l)`，範圍取 logs 為 `logsBetween(a,b)`，門檻常數為 `KPI`。

- [x] 新增「某日是否計入必做」判定：課表鍵在 MUST 內且當天有任一動作打勾。REST 日打勾回傳 false。
- [x] 新增「某週必做完成數」函式：輸入該週週一，回傳完成件數與最低配使用次數。最低配該週只有第一次計入。
- [x] 新增「日期範圍取 logs」函式：輸入起訖日（含），回傳範圍內有紀錄的 [日期, log] 序列，依日期排序；範圍外不取，無資料回空。
- [x] 新增集中的門檻常數物件：必做總件數 24、成立門檻 20、連續掉隊門檻 3、CPAP 門檻 4、KPI 週範圍 W1–W6。
- [x] weekDone 改為呼叫新函式，回傳形狀 {n, minUsed} 不變。
- [x] smoke_test.js 現有 weekDone 案例（2 最低配只算 1、REST 不算 → 3/4）原樣通過，一行不改。
- [x] smoke_test.js 新增：日期範圍函式含邊界、範圍外不取、無資料回空；四個門檻常數值等於定稿數字。
- [x] `node smoke_test.js` 全過。
