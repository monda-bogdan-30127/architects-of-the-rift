export function startNextSplit() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("rift-series-state");
  window.localStorage.removeItem("rift-active-series-draft");
  window.localStorage.removeItem("rift-player-season-stats");

  Object.keys(window.localStorage).forEach((key) => {
    if (key.startsWith("rift-regular-season-awards-shown")) {
      window.localStorage.removeItem(key);
    }
  });

  window.location.reload();
}
