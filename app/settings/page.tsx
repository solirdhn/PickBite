"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Settings {
  restaurantName: string;
  defaultOrderType: "Dine In" | "Take Away";
  pin: string;
}

const DEFAULT_SETTINGS: Settings = {
  restaurantName: "Bite Bistro",
  defaultOrderType: "Dine In",
  pin: "1234",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinMismatch, setPinMismatch] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pb_settings");
    if (stored) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    }
  }, []);

  const handleSave = () => {
    if (settings.pin.length !== 4 || !/^\d{4}$/.test(settings.pin)) {
      alert("PIN must be exactly 4 digits.");
      return;
    }
    if (settings.pin !== pinConfirm && pinConfirm !== "") {
      setPinMismatch(true);
      return;
    }
    setPinMismatch(false);
    localStorage.setItem("pb_settings", JSON.stringify(settings));
    localStorage.setItem("pb_pin", settings.pin);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetData = () => {
    if (confirmReset) {
      localStorage.removeItem("pb_menu_data");
      localStorage.removeItem("pb_menu_v");
      localStorage.removeItem("pb_orders");
      window.location.reload();
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  return (
    <main className="main-content settings-page">
      <div className="welcome-header-container">
        <div className="dashboard-logo-large">
          <Image
            src="/PickBiteLogo.png"
            alt="PickBite Logo"
            width={276}
            height={139}
            priority
          />
        </div>
        <div className="welcome-divider"></div>
        <section className="welcome-section">
          <h1>Settings</h1>
          <p className="text-muted">Manage your restaurant profile and preferences.</p>
        </section>
      </div>

      <div className="settings-grid">
        {/* Restaurant Profile */}
        <div className="card settings-card">
          <div className="settings-section-header">
            <div className="settings-icon-box">
              <i className="fas fa-store"></i>
            </div>
            <div>
              <h3 className="m-0">Restaurant Profile</h3>
              <p className="text-muted fs-sm m-0">Update your restaurant&apos;s public information</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="restaurantName">Restaurant Name</label>
              <input
                id="restaurantName"
                type="text"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                placeholder="e.g. Bite Bistro"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card settings-card">
          <div className="settings-section-header">
            <div className="settings-icon-box">
              <i className="fas fa-sliders-h"></i>
            </div>
            <div>
              <h3 className="m-0">Preferences</h3>
              <p className="text-muted fs-sm m-0">Default behaviour for new orders</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Default Order Type</label>
              <div className="settings-toggle-group">
                <button
                  className={`settings-toggle-btn ${settings.defaultOrderType === "Dine In" ? "active" : ""}`}
                  onClick={() => setSettings({ ...settings, defaultOrderType: "Dine In" })}
                >
                  <i className="fas fa-utensils"></i> Dine In
                </button>
                <button
                  className={`settings-toggle-btn ${settings.defaultOrderType === "Take Away" ? "active" : ""}`}
                  onClick={() => setSettings({ ...settings, defaultOrderType: "Take Away" })}
                >
                  <i className="fas fa-shopping-bag"></i> Take Away
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security / PIN */}
        <div className="card settings-card">
          <div className="settings-section-header">
            <div className="settings-icon-box">
              <i className="fas fa-lock"></i>
            </div>
            <div>
              <h3 className="m-0">Security</h3>
              <p className="text-muted fs-sm m-0">Change your 4-digit login PIN</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="newPin">New PIN (4 digits)</label>
              <input
                id="newPin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={settings.pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setSettings({ ...settings, pin: val });
                  setPinMismatch(false);
                }}
                placeholder="••••"
                className={pinMismatch ? "input-error" : ""}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPin">Confirm PIN</label>
              <input
                id="confirmPin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinConfirm}
                onChange={(e) => {
                  setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setPinMismatch(false);
                }}
                placeholder="••••"
                className={pinMismatch ? "input-error" : ""}
              />
              {pinMismatch && <p className="input-error-msg">PINs do not match.</p>}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card settings-card danger-card">
          <div className="settings-section-header">
            <div className="settings-icon-box danger-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <h3 className="m-0 text-danger-title">Danger Zone</h3>
              <p className="text-muted fs-sm m-0">These actions cannot be undone</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="danger-row">
              <div>
                <p className="fw-semibold fs-sm m-0">Reset All Data</p>
                <p className="text-muted fs-xs m-0">Clears all menu items and order history</p>
              </div>
              <button
                className={`btn-danger ${confirmReset ? "btn-danger-confirm" : ""}`}
                onClick={handleResetData}
              >
                <i className="fas fa-trash"></i>
                {confirmReset ? "Confirm Reset" : "Reset Data"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-save-bar">
        <button className="btn-primary settings-save-btn" onClick={handleSave}>
          {saved ? (
            <><i className="fas fa-check"></i> Saved!</>
          ) : (
            <><i className="fas fa-save"></i> Save Changes</>
          )}
        </button>
      </div>
    </main>
  );
}
