document.getElementById("downloadBtn").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value;
  const status = document.getElementById("status");
  const apiUrl = "https://yt2mp3web-production.up.railway.app/download";

  if (!url) {
    status.textContent = "請輸入 YouTube 連結！";
    return;
  }

  status.textContent = "正在處理下載，請稍候...";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) throw new Error("伺服器錯誤");

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "audio.mp3";
    a.click();
    status.textContent = "下載完成 ✅";
  } catch (err) {
    console.error(err);
    status.textContent = "下載失敗，請稍後再試！";
  }
});
