function updateSparePartsBasicInfo() {
  const sbnMasterData = saas.getSheetByName("MasterData");
  const sbnSafeStock  = saas.getSheetByName("安全库存数据");
  const sbnBasicInfo  = saas.getSheetByName("备件基础信息");
  const sbnLog        = saas.getSheetByName("Log");
  const execTime      = Utilities.formatDate(new Date(), currentTimeZone, "yyyy-MM-dd HH:mm:ss");

  try {
    // 1. MasterData: A=物料, B=物料描述, C=非限制使用的库存, E=日期 → 取每个物料最新日期的行
    const mdLr  = sbnMasterData.getLastRow();
    const mdMap = {};
    if (mdLr > 1) {
      sbnMasterData.getRange(2, 1, mdLr - 1, 5).getValues().forEach(row => {
        const mat = String(row[0]).trim();
        if (!mat) return;
        if (!mdMap[mat] || row[4] > mdMap[mat].date) {
          mdMap[mat] = { desc: row[1], stock: row[2], date: row[4] };
        }
      });
    }

    // 2. 安全库存数据: A=物料, B=安全库存
    const ssLr    = sbnSafeStock.getLastRow();
    const safeMap = {};
    if (ssLr > 1) {
      sbnSafeStock.getRange(2, 1, ssLr - 1, 2).getValues().forEach(row => {
        const mat = String(row[0]).trim();
        if (mat) safeMap[mat] = row[1];
      });
    }

    // 3. 读取备件基础信息现有数据，按同步规则更新 B/D/E，保留 C/F/G
    const biLr         = sbnBasicInfo.getLastRow();
    const existingMats = new Set();
    let updateCount    = 0;
    let outputData     = [];

    if (biLr > 1) {
      outputData = sbnBasicInfo.getRange(2, 1, biLr - 1, 7).getValues().map(row => {
        const mat       = String(row[0]).trim();
        existingMats.add(mat);
        const safeStock = safeMap[mat] !== undefined ? safeMap[mat] : 0;
        if (mat && mdMap[mat]) {
          updateCount++;
          // 两边都有：更新 B/D/E，保留 C/F
          return [mat, mdMap[mat].desc, row[2], safeStock, mdMap[mat].stock, row[5], row[6]];
        } else {
          // 备件基础信息有但 MasterData 没有：更新 D，E 置 0，保留 B/C/F
          return [mat, row[1], row[2], safeStock, 0, row[5], row[6]];
        }
      });
    }

    // 4. MasterData 新增但备件基础信息中没有的物料 → 追加
    let addCount = 0;
    Object.keys(mdMap).forEach(mat => {
      if (!existingMats.has(mat)) {
        const safeStock = safeMap[mat] !== undefined ? safeMap[mat] : 0;
        outputData.push([mat, mdMap[mat].desc, "", safeStock, mdMap[mat].stock, "", ""]);
        addCount++;
      }
    });

    // 5. 清空旧数据并一次性写入
    if (biLr > 1) sbnBasicInfo.getRange(2, 1, biLr - 1, 7).clearContent();
    if (outputData.length > 0) sbnBasicInfo.getRange(2, 1, outputData.length, 7).setValues(outputData);

    // 6. 写入 Log
    sbnLog.appendRow([execTime, "备件基础信息同步", "更新" + updateCount + "条，新增" + addCount + "条", "成功", "成功"]);

  } catch (e) {
    sbnLog.appendRow([execTime, "备件基础信息同步", "", "失败", e.message]);
  }
}
