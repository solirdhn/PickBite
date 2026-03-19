"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Settings {
  restaurantName: string;
  contactNumber: string;
  email: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  defaultOrderType: "Dine In" | "Take Away";
}

const DEFAULT_SETTINGS: Settings = {
  restaurantName: "Bite Bistro",
  contactNumber: "+1 (555) 0123",
  email: "hello@bitebistro.com",
  address: "123 Gourmet Ave, Foodie City, FC 12345",
  description: "A premium dining experience for food enthusiasts.",
  openingTime: "08:00",
  closingTime: "22:00",
  defaultOrderType: "Dine In",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pb_settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsed,
      });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("pb_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
          <p className="text-muted">Manage your restaurant profile information.</p>
        </section>
      </div>

      <div className="settings-content mt-1">
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

            <div className="grid-1-1">
              <div className="form-group">
                <label htmlFor="contactNumber">Merchant Contact Number</label>
                <input
                  id="contactNumber"
                  type="text"
                  value={settings.contactNumber}
                  onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                  placeholder="e.g. +1 (555) 0123"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Public Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="e.g. hello@bitebistro.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Restaurant Address</label>
              <textarea
                id="address"
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Street, City, Postcode"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="description">Restaurant Description</label>
              <textarea
                id="description"
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="A brief bio of your restaurant"
              ></textarea>
            </div>

            <div className="grid-1-1">
              <div className="form-group">
                <label htmlFor="openingTime">Opening Time</label>
                <input
                  id="openingTime"
                  type="time"
                  value={settings.openingTime}
                  onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="closingTime">Closing Time</label>
                <input
                  id="closingTime"
                  type="time"
                  value={settings.closingTime}
                  onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
