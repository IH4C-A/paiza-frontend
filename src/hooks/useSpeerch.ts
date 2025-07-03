export const fetchPlantResponse = async (
  transcript: string,
  speaker: number,
  character: string,
) => {
  const res = await fetch("http://localhost:5000/talk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transcript,
      speaker,
      character,
    }),
  });

  if (!res.ok) throw new Error("VOICEVOX応答の取得に失敗しました");

  const audioBlob = await res.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  new Audio(audioUrl).play();
};
