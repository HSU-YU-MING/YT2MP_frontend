document.getElementById("downloadBtn").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value;
  const filename = document.getElementById("filenameInput").value || "audio";
  const status = document.getElementById("status");
  const progressBar = document.getElementById("progressBar");
  const apiUrl = "https://yt2mp3web-production.up.railway.app/download";

  if (!url) {
    status.textContent = "請輸入 YouTube 連結！";
    status.className = "error";
    return;
  }

  status.textContent = "正在處理下載中，請稍候...";
  status.className = "";
  progressBar.value = 0;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) throw new Error("伺服器錯誤");

    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length") || 1;
    let receivedLength = 0;
    let chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
      progressBar.value = (receivedLength / contentLength) * 100;
    }

    const blob = new Blob(chunks, { type: "audio/mpeg" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename + ".mp3";
    a.click();

    status.textContent = "✅ 下載完成！";
    status.className = "success";
    progressBar.value = 100;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ 下載失敗，請稍後再試！";
    status.className = "error";
    progressBar.value = 0;
  }
});
