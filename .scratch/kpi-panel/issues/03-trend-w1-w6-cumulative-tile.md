# 03 — Trend 頁 W1–W6 必做累計磚與出席率

**Parent:** PRD.md（六週 KPI 面板）

**What to build:** Trend 頁原本寫死「本週必做 n/4」的磚，改成顯示「W1–W6 必做 N/24（門檻 20）」加一行出席率百分比。今天在 W0 時顯示 0/24；今天超過 W6 時數字定格在 W1–W6 的結果；W1–W6 進行中即時更新。累計沿用「最低配每 7 天只算 1 次」與「REST 日不算」。

**Blocked by:** 01 — 共用 helper 與門檻常數

**Status:** resolved

- [x] 以 cfg.start 為 W1 週一，逐週呼叫 01 的週函式，加總 W1–W6 六週。
- [x] 磚主文字為 `N/24`，副標含「W1–W6 必做」與「門檻 20」，另一行出席率 `round(N/24*100)%`。24 與 20 引用常數，不寫字面數字。
- [x] 今天在 W0 時顯示 0/24、0%。
- [x] 今天超過 W6 時，W7 之後的紀錄不影響數字。
- [x] 現有 tWk 磚被取代，Trend 頁不多一塊重複磚。
- [x] smoke_test.js 新增：塞 W1–W6 各週不同完成數（含最低配兩次、REST 灌水），renderTrend 後累計磚 textContent 為預期 N/24 與百分比；另測今天在 W0 時為 0/24。
- [x] `node smoke_test.js` 全過，現有測試一行不改。
