import { useRegisterSW } from "virtual:pwa-register/react";
import "./ReloadPrompt.css";

/**
 * When a new version of the app is deployed, shows a toast so the user can
 * tap "Refresh" to load it—no need to delete and re-add the PWA.
 */
function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      // Periodically check for updates (e.g. when PWA is left open)
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // every hour
      }
    },
    onRegisterError(error) {
      console.warn("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="reload-prompt-container" role="status" aria-live="polite">
      <div className="reload-prompt-toast">
        <p className="reload-prompt-message">
          {offlineReady
            ? "App ready to work offline."
            : "Update available. Tap Refresh to get the latest version."}
        </p>
        <div className="reload-prompt-actions">
          {needRefresh && (
            <button
              type="button"
              className="reload-prompt-button reload-prompt-button-primary"
              onClick={() => updateServiceWorker(true)}
            >
              Refresh
            </button>
          )}
          <button
            type="button"
            className="reload-prompt-button"
            onClick={close}
          >
            {needRefresh ? "Later" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReloadPrompt;
