document.getElementById("downloadBtn").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value.trim();
  const fileName = document.getElementById("filenameInput").value.trim();
  const status = document.getElementById("status");
  const apiUrl = "https://yt2mp3web-production.up.railway.app/download";

  if (!url) {
    status.textContent = "❗請輸入 YouTube 連結！";
    return;
  }

  status.textContent = "正在處理下載，請稍候...";
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");
  progressContainer.classList.remove("d-none");
  progressBar.style.width = "0%";
  progressBar.textContent = "0%";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) throw new Error("伺服器錯誤");

    const contentLength = response.headers.get("Content-Length");
    if (!contentLength) {
      // 無法取得長度 fallback
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName ? `${fileName}.mp3` : "audio.mp3";
      a.click();
      status.textContent = "✅ 下載完成！";
      return;
    }

    // 顯示進度條下載
    const reader = response.body.getReader();
    let receivedLength = 0;
    const total = parseInt(contentLength);
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
      const percent = Math.floor((receivedLength / total) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent}%`;
    }

    const blob = new Blob(chunks);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName ? `${fileName}.mp3` : "audio.mp3";
    a.click();
    status.textContent = "✅ 下載完成！";

  } catch (err) {
    console.error(err);
    status.textContent = "❌ 下載失敗，請稍後再試！";
  }
});
