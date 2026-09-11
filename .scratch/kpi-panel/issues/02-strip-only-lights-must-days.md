# 02 — 週曆條只亮必做日

**Parent:** PRD.md（六週 KPI 面板）

**What to build:** 週曆條上的 ✓ 與亮綠只出現在「必做課表日（LOW／UPP／SAT／SATGYM／SUN）且有打勾」的日子。平日 HIIT 套餐日（REST）打了死蟲式也不亮。最低配打勾的日子照樣亮（有出席）。進度圓環維持當天動作完成比例，不動。

**Blocked by:** 01 — 共用 helper 與門檻常數

**Status:** ready-for-agent

- [ ] renderStrip 的 did 判定改用 01 的「某日是否計入必做」函式，不再是「任何動作有勾」。
- [ ] REST 日有打勾時，該格不含 did class、不顯示 ✓。
- [ ] 必做日有打勾時，該格含 did class 並顯示 ✓。
- [ ] 最低配打勾的必做日照樣亮。
- [ ] 進度圓環行為不變。
- [ ] smoke_test.js 新增：塞一週資料含 REST 日打勾與 LOW 日打勾，renderStrip 後 wstrip 的 innerHTML 只有 LOW 那天含 did。
- [ ] `node smoke_test.js` 全過，現有測試一行不改。
