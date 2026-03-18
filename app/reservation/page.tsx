"use client";

import { useState } from "react";
import Image from "next/image";

interface Reservation {
  id: number;
  name: string;
  pax: number;
  date: string;
  time: string;
}

export default function ReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 1, name: "Alice Wong", pax: 4, date: "2026-03-20", time: "18:30" },
    { id: 2, name: "David Lim", pax: 2, date: "2026-03-21", time: "20:00" },
    { id: 3, name: "Sarah Jones", pax: 6, date: "2026-03-21", time: "19:00" },
    { id: 4, name: "Michael Tan", pax: 3, date: "2026-03-22", time: "12:30" },
    { id: 5, name: "Emily Chen", pax: 5, date: "2026-03-22", time: "19:45" },
  ]);

  const [formData, setFormData] = useState({ name: "", pax: 2, date: "", time: "" });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.time) return;

    const newRes: Reservation = {
      id: Date.now(),
      name: formData.name,
      pax: Number(formData.pax),
      date: formData.date,
      time: formData.time,
    };

    setReservations((prev) => [...prev, newRes]);
    setFormData({ name: "", pax: 2, date: "", time: "" });
  };

  return (
    <main className="main-content reservation-page">
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
          <h1>Table Reservations</h1>
          <p className="text-muted">Manage your restaurant&apos;s table bookings and availability.</p>
        </section>
      </div>

      <div className="grid-1-1 mt-20">
        <div className="card">
          <h3 className="mb-15">Reservation Received Inbox</h3>
          <div className="modern-list">
            <div className="list-header-modern grid-reservations">
              <div className="col-info">Name</div>
              <div className="col-pax text-center">Pax</div>
              <div className="col-date text-center">Date</div>
              <div className="col-time text-right">Time</div>
            </div>
            <div className="list-body-modern">
              {reservations.length === 0 ? (
                <div className="p-3 text-center text-muted">No reservations yet.</div>
              ) : (
                reservations.map((res) => (
                  <div key={res.id} className="list-row-modern grid-reservations">
                    <div className="col-info fw-bold text-dark fs-sm">{res.name}</div>
                    <div className="col-pax text-center"><span className="badge-pill bg-light text-primary fw-bold fs-sm">{res.pax} <i className="fas fa-user fs-xs"></i></span></div>
                    <div className="col-date text-center text-muted fs-xs fw-medium">{res.date}</div>
                    <div className="col-time text-right fw-bold text-dark fs-sm">{res.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-15">Create Reservation</h3>
          <form onSubmit={handleCreate} className="flex flex-column gap-1">
            <div className="form-group mb-0">
              <label htmlFor="resName" className="fs-sm fw-bold text-muted text-uppercase mb-05 block">Name</label>
              <input
                id="resName"
                type="text"
                placeholder="e.g. John Doe"
                className="w-full rounded form-input-modern"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group mb-0">
              <label htmlFor="resPax" className="fs-sm fw-bold text-muted text-uppercase mb-05 block">Number of Pax</label>
              <input
                id="resPax"
                type="number"
                min="1"
                className="w-full rounded form-input-modern"
                value={formData.pax}
                onChange={(e) => setFormData({ ...formData, pax: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="grid-1-1 gap-1">
              <div className="form-group mb-0">
                <label htmlFor="resDate" className="fs-sm fw-bold text-muted text-uppercase mb-05 block">Date</label>
                <input
                  id="resDate"
                  type="date"
                  className="w-full rounded form-input-modern"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group mb-0">
                <label htmlFor="resTime" className="fs-sm fw-bold text-muted text-uppercase mb-05 block">Time</label>
                <input
                  id="resTime"
                  type="time"
                  className="w-full rounded form-input-modern"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary mt-1 p-2">
              <i className="fas fa-calendar-plus mr-2"></i> Add Reservation
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
