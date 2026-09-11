# 04 — Trend 頁 CPAP 平均磚

**Parent:** PRD.md（六週 KPI 面板）

**What to build:** Trend 頁新增一塊「CPAP 平均 X.X h（門檻 4）」磚。只算 W1 週一到今天之間有填 CPAP 時數的日子，忘記填的不當 0。一天都沒填顯示「—」。達標（≥4h）與未達標用既有 tile 顏色機制區分。

**Blocked by:** 01 — 共用 helper 與門檻常數

**Status:** ready-for-agent

- [ ] 用 01 的日期範圍函式取 W1 週一到今天（含）的 logs，只取 CPAP 時數為正數的日子。
- [ ] 平均顯示一位小數，副標含「CPAP 平均」與「門檻 4」。4 引用常數。
- [ ] 無資料顯示「—」，不出現 NaN。
- [ ] 達標與未達標用不同顏色，沿用既有 tile 樣式，不引入新樣式系統。
- [ ] smoke_test.js 新增：塞 W0 有填、W1 部分填部分空，renderTrend 後磚字串等於只取 W1 有填日的平均；全空時顯示 —。
- [ ] `node smoke_test.js` 全過，現有測試一行不改。
