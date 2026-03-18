"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CORRECT_PIN = "1234"; // Default PIN — can be changed in Settings

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (localStorage.getItem("pb_auth") === "true") {
      router.replace("/");
    }
  }, [router]);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError("");

    if (newPin.length === 4) {
      setTimeout(() => {
        const savedPin = localStorage.getItem("pb_pin") || CORRECT_PIN;
        if (newPin === savedPin) {
          localStorage.setItem("pb_auth", "true");
          router.replace("/");
        } else {
          setShake(true);
          setError("Incorrect PIN. Try again.");
          setTimeout(() => {
            setPin("");
            setShake(false);
          }, 600);
        }
      }, 150);
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError("");
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div className="login-page">
      <div className={`login-card ${shake ? "shake" : ""}`}>
        <div className="login-logo">
          <Image
            src="/PickBiteLogo.png"
            alt="PickBite Logo"
            width={180}
            height={90}
            priority
          />
        </div>
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Enter your PIN to access the dashboard</p>

        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`pin-dot ${i < pin.length ? "filled" : ""}`} />
          ))}
        </div>

        {error && <p className="pin-error">{error}</p>}

        <div className="pin-grid">
          {digits.map((d, idx) => {
            if (d === "") return <div key={idx} />;
            return (
              <button
                key={idx}
                className={`pin-btn ${d === "⌫" ? "pin-delete" : ""}`}
                onClick={() => d === "⌫" ? handleDelete() : handleDigit(d)}
              >
                {d}
              </button>
            );
          })}
        </div>

        <p className="pin-hint">Default PIN: <strong>1234</strong></p>
      </div>
    </div>
  );
}
