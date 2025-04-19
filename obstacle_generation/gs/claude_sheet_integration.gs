function generateBlenderScripts() {
  const ss = SpreadsheetApp.openById("1QldY7rz-flfAh425jDM0YXz4I9OUIdkvmHb7umNpclM");
  const sheet = ss.getSheetByName("Test");
  const outputSheet = ss.getSheetByName("Output");
  const folder = DriveApp.getFolderById("17aZ3qML9mfiyinvlJU1o0Dyge_Ryz_Tq");

  if (!outputSheet) {
    Logger.log("❌ Output sheet not found!");
    return;
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const id = data[i][0];
    const prompt = data[i][1];
    const status = data[i][2];

    Logger.log(`📋 Row ${i + 1} — ID: ${id}, Prompt: ${prompt}, Status: ${status}`);

    if (!prompt || status === "✅ Done") {
      Logger.log("⏭️ Skipping row due to missing prompt or already completed.");
      continue;
    }

    Logger.log(`🚀 Sending prompt to Claude: "${prompt}"`);
    const result = sendPromptToClaude(prompt);

    Logger.log("🌐 Claude API raw response: " + JSON.stringify(result));

    if (!result || !result.code || result.code.startsWith("# ERROR")) {
      Logger.log("❌ Claude returned no valid code.");
      Logger.log("📦 Claude response: " + JSON.stringify(result));
      continue; // 🚫 Skip file creation and marking row as done
    }

    const filename = `blender_script_${id}.py`;
    const file = folder.createFile(filename, result.code, MimeType.PLAIN_TEXT);

    Logger.log("✅ Created file in Drive: " + file.getUrl());

    outputSheet.appendRow([
      result.uuid || Utilities.getUuid(),
      id,
      result.objectName || `Obstacle ${id}`,
      "", "", "",  // Optional: Thumbnail, Score, Rank
      result.fileUrl || file.getUrl(),
      result.date || new Date()
    ]);

    Logger.log(`📤 Appended result to Output sheet for ID ${id}`);

    sheet.getRange(i + 1, 3).setValue("✅ Done");
    Logger.log(`✔️ Marked row ${i + 1} as Done`);
  }
}


function sendPromptToClaude(prompt) {
  try {
    const response = UrlFetchApp.fetch("https://9aef-2605-a601-ae94-b900-49d1-fe1d-57e3-6ee2.ngrok-free.app/runBlender", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ prompt }),
      muteHttpExceptions: true
    });

    Logger.log("🌐 Claude API raw response: " + response.getContentText());

    const json = JSON.parse(response.getContentText());

    if (json.code) {
      return json; // Return full response
    } else {
      Logger.log("❌ Claude returned no code.");
      return {
        code: "# ERROR: Claude failed\n" + response.getContentText(),
        uuid: Utilities.getUuid(),
        objectName: "",
        fileUrl: "",
        date: new Date()
      };
    }
  } catch (e) {
    Logger.log("🔥 Claude fetch failed: " + e.toString());
    return {
      code: "# ERROR: Claude crashed\n" + e.toString(),
      uuid: Utilities.getUuid(),
      objectName: "",
      fileUrl: "",
      date: new Date()
    };
  }
}
