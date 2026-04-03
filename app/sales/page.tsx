"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SalesHistoryItem {
  date: string;
  orders: number;
  revenue: number;
  breakdown: {
    qr: number;
    credit: number;
    debit: number;
    cash: number;
  };
}

export default function SalesPage() {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    orderCount: 0,
    averageOrderValue: 0,
    breakdown: {
      qr: 0,
      credit: 0,
      debit: 0,
      cash: 0
    }
  });

  const [history, setHistory] = useState<SalesHistoryItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const orders = JSON.parse(localStorage.getItem("pb_orders") || "[]");

    // Calculate basic sales metrics for today
    const totalRevenue = orders.reduce(
      (acc: number, curr: any) => acc + parseFloat(curr.total || 0),
      0
    );
    const orderCount = orders.length;
    const avgValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Calculate today's breakdown
    const todayBreakdown = {
      qr: 0,
      credit: 0,
      debit: 0,
      cash: 0
    };

    orders.forEach((order: any) => {
      const amount = parseFloat(order.total || 0);
      const method = (order.paymentMethod || 'Cash').toLowerCase();

      if (method.includes('qr')) todayBreakdown.qr += amount;
      else if (method.includes('credit')) todayBreakdown.credit += amount;
      else if (method.includes('debit')) todayBreakdown.debit += amount;
      else todayBreakdown.cash += amount;
    });

    setSalesData({
      totalSales: totalRevenue,
      orderCount: orderCount,
      averageOrderValue: avgValue,
      breakdown: todayBreakdown
    });

    // Generate Mock History for the last 4 days
    const mockHistory: SalesHistoryItem[] = [];
    const now = new Date();

    for (let i = 1; i <= 4; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const dateStr = d.toLocaleDateString('en-MY', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      // Semi-random but realistic data
      const dailyOrders = Math.floor(Math.random() * 20) + 10; // 10-30 orders
      const dailyRevenue = dailyOrders * (Math.random() * 10 + 15); // Avg RM 15-25 per order

      // Payment Breakdown Logic
      const qrPct = 0.4 + Math.random() * 0.2; // 40-60% QR
      const creditPct = 0.2 + Math.random() * 0.1; // 20-30% Credit
      const debitPct = 0.1 + Math.random() * 0.1; // 10-20% Debit
      const cashPct = 1 - (qrPct + creditPct + debitPct);

      mockHistory.push({
        date: i === 1 ? "Yesterday" : dateStr,
        orders: dailyOrders,
        revenue: dailyRevenue,
        breakdown: {
          qr: dailyRevenue * qrPct,
          credit: dailyRevenue * creditPct,
          debit: dailyRevenue * debitPct,
          cash: dailyRevenue * cashPct
        }
      });
    }
    setHistory(mockHistory);
  }, []);

  return (
    <main className="main-content sales-page">
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
          <h1>Sales Analytics</h1>
          <p className="text-muted">Track your restaurant&apos;s financial performance and trends.</p>
        </section>
      </div>

      <div className="stats-grid">
        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Total Sales (Today)</div>
            <div className="stat-value-modern">RM {salesData.totalSales.toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Total Orders (Today)</div>
            <div className="stat-value-modern">{salesData.orderCount}</div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern">
            <i className="fas fa-calculator"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Avg. Order Value</div>
            <div className="stat-value-modern">RM {salesData.averageOrderValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card-modern action-orange" onClick={() => setIsReceiptOpen(true)}>
          <div className="stat-icon-modern">
            <i className="fas fa-print"></i>
          </div>
          <div className="stat-content-modern">
            <div className="stat-label-modern">Close Shift</div>
            <div className="stat-value-modern">Print Report</div>
          </div>
        </div>
      </div>

      <div className="grid-2-1 mt-20">
        <div className="card">
          <h3 className="mb-15">Sales History (Last 4 Days)</h3>
          <div className="modern-list">
            <div className="list-header-modern">
              <div className="col-info">Date</div>
              <div className="col-status">Orders</div>
              <div className="col-total">Revenue</div>
            </div>
            <div className="list-body-modern">
              {history.map((day, idx) => (
                <div
                  key={idx}
                  className={`list-row-modern ${selectedIdx === idx ? 'selected' : ''}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div className="col-info">
                    <div className="order-customer-name">{day.date}</div>
                  </div>
                  <div className="col-status">
                    <span className="status-badge-modern completed">
                      {day.orders} Orders
                    </span>
                  </div>
                  <div className="col-total">
                    <span className="order-total-value">RM {day.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-15">
            {selectedIdx !== null ? `Payment Breakdown - ${history[selectedIdx].date}` : 'Analytics Insights'}
          </h3>

          {selectedIdx !== null ? (
            <div className="payment-breakdown-details">
              {[
                { label: 'QR Payment', value: history[selectedIdx].breakdown.qr },
                { label: 'Credit Card', value: history[selectedIdx].breakdown.credit },
                { label: 'Debit Card', value: history[selectedIdx].breakdown.debit },
                { label: 'Cash', value: history[selectedIdx].breakdown.cash }
              ].map((item, i) => (
                <div key={i} className="breakdown-simple-row">
                  <span className="text-muted fs-sm fw-medium">{item.label}</span>
                  <span className="fw-bold fs-md">RM {item.value.toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-20 pt-15 border-top flex-between flex-align-center">
                <span className="text-muted fw-bold fs-sm text-uppercase">Total Daily Revenue</span>
                <span className="order-total-value fs-xl">
                  RM {history[selectedIdx].revenue.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-20 text-center text-muted border-dashed-modern">
              <i className="fas fa-lightbulb fs-xl opacity-10 mb-10 text-primary"></i>
              <p className="fs-sm">Click on a day in your sales history to view the detailed payment breakdown.</p>
            </div>
          )}
        </div>
      </div>
      {isReceiptOpen && (
        <div className="modal-overlay">
          <div className="modal-content receipt-modal">
            <div className="receipt-container">
              <div className="receipt-header">
                <div className="flex-align-center flex-justify-center mb-05">
                  <Image
                    src="/PickBiteLogo.png"
                    alt="PickBite Logo"
                    width={290}
                    height={145}
                    className="receipt-logo-img"
                  />
                </div>
                <p className="receipt-report-title">Shift Closing Report</p>
              </div>

              <div className="receipt-info">
                <p>Date: {new Date().toLocaleDateString('en-MY')}</p>
                <p>Time: {new Date().toLocaleTimeString('en-MY')}</p>
                <p>Status: STORE CLOSED</p>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-row">
                <span>Total Orders</span>
                <span>{salesData.orderCount}</span>
              </div>
              <div className="receipt-row">
                <span>Avg Order Value</span>
                <span>RM {salesData.averageOrderValue.toFixed(2)}</span>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-row">
                <strong>PAYMENT METHODS</strong>
              </div>
              <div className="receipt-row">
                <span>QR Payment</span>
                <span>RM {salesData.breakdown.qr.toFixed(2)}</span>
              </div>
              <div className="receipt-row">
                <span>Credit Card</span>
                <span>RM {salesData.breakdown.credit.toFixed(2)}</span>
              </div>
              <div className="receipt-row">
                <span>Debit Card</span>
                <span>RM {salesData.breakdown.debit.toFixed(2)}</span>
              </div>
              <div className="receipt-row">
                <span>Cash</span>
                <span>RM {salesData.breakdown.cash.toFixed(2)}</span>
              </div>

              <div className="receipt-row total">
                <span>TOTAL SALES</span>
                <span>RM {salesData.totalSales.toFixed(2)}</span>
              </div>

              <div className="receipt-footer">
                <p>End of Day Report</p>
                <p>Thank you for your hard work!</p>
                <p>*** PickBite POS ***</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-danger-solid" onClick={() => setIsReceiptOpen(false)}>
                <i className="fas fa-times mr-10"></i> Close
              </button>
              <button className="btn-primary" onClick={() => window.print()}>
                <i className="fas fa-print mr-10"></i> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
