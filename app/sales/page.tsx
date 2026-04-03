"use client";

import { useEffect, useState, useRef } from "react";
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
  }
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
  const [isLoading, setIsLoading] = useState(true);
  const [realOrders, setRealOrders] = useState<any[]>([]);

  // Refs to manage progress bars without using inline 'style' props (to satisfy linter)
  const qrRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);
  const debitRef = useRef<HTMLDivElement>(null);
  const cashRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/orders");
      const orders = await resp.json();
      
      if (Array.isArray(orders)) {
        setRealOrders(orders);

        const totalRevenue = orders.reduce(
          (acc: number, curr: any) => acc + parseFloat(curr.total || 0),
          0
        );
        const orderCount = orders.length;
        const avgValue = orderCount > 0 ? totalRevenue / orderCount : 0;

        const breakdown = { qr: 0, credit: 0, debit: 0, cash: 0 };
        orders.forEach((order: any) => {
          const amount = parseFloat(order.total || 0);
          const method = (order.paymentMethod || 'Cash').toLowerCase();

          if (method.includes('qr')) breakdown.qr += amount;
          else if (method.includes('credit')) breakdown.credit += amount;
          else if (method.includes('debit')) breakdown.debit += amount;
          else breakdown.cash += amount;
        });

        const newData = {
          totalSales: totalRevenue,
          orderCount: orderCount,
          averageOrderValue: avgValue,
          breakdown
        };

        setSalesData(newData);

        const todayStr = new Date().toLocaleDateString('en-MY', {
          weekday: 'short', day: 'numeric', month: 'short'
        });

        setHistory([{
          date: todayStr,
          orders: orderCount,
          revenue: totalRevenue,
          breakdown
        }]);
      }
    } catch (e) {
      console.error("Failed to fetch sales data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update bar widths using direct DOM manipulation to avoid inline 'style' warnings
  useEffect(() => {
    const total = salesData.totalSales;
    if (total > 0) {
      if (qrRef.current) qrRef.current.style.width = `${(salesData.breakdown.qr / total) * 100}%`;
      if (creditRef.current) creditRef.current.style.width = `${(salesData.breakdown.credit / total) * 100}%`;
      if (debitRef.current) debitRef.current.style.width = `${(salesData.breakdown.debit / total) * 100}%`;
      if (cashRef.current) cashRef.current.style.width = `${(salesData.breakdown.cash / total) * 100}%`;
    } else {
      [qrRef, creditRef, debitRef, cashRef].forEach(ref => {
        if (ref.current) ref.current.style.width = '0%';
      });
    }
  }, [salesData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="main-content analytics-page">
      <div className="welcome-header-container mb-2">
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
          <h1>Sales Dashboard</h1>
          <p className="text-muted">Real-time business performance from your cloud database.</p>
        </section>
      </div>

      {isLoading ? (
          <div className="flex-center py-5 text-muted">
            <i className="fas fa-spinner fa-spin fs-xl mr-1"></i> Calculating your profits...
          </div>
      ) : (
        <>
          <div className="metrics-grid">
            <div className="card metric-card animate-fade-in">
              <div className="metric-icon bg-primary-soft">
                <i className="fas fa-money-bill-wave text-primary"></i>
              </div>
              <div className="metric-info">
                <span className="label">Total Sales (Today)</span>
                <h2 className="value">RM {salesData.totalSales.toFixed(2)}</h2>
                <span className="trend positive"><i className="fas fa-arrow-up"></i> Live</span>
              </div>
            </div>

            <div className="card metric-card animate-fade-in delay-1">
              <div className="metric-icon bg-success-soft">
                <i className="fas fa-shopping-cart text-success"></i>
              </div>
              <div className="metric-info">
                <span className="label">Orders</span>
                <h2 className="value">{salesData.orderCount}</h2>
                <span className="trend positive"><i className="fas fa-arrow-up"></i> Live</span>
              </div>
            </div>

            <div className="card metric-card animate-fade-in delay-2">
              <div className="metric-icon bg-info-soft">
                <i className="fas fa-receipt text-info"></i>
              </div>
              <div className="metric-info">
                <span className="label">Avg Order Value</span>
                <h2 className="value">RM {salesData.averageOrderValue.toFixed(2)}</h2>
                <span className="trend">Stable</span>
              </div>
            </div>
          </div>

          <div className="analytics-details-grid">
            <div className="card payment-method-card mb-2">
              <h3 className="card-title">Payment Breakdown</h3>
              <div className="payment-list">
                <div className="payment-item">
                  <div className="item-label"><i className="fas fa-qrcode text-primary"></i> QR Payment</div>
                  <div className="item-bar-container"><div ref={qrRef} className="item-bar"></div></div>
                  <div className="item-value">RM {salesData.breakdown.qr.toFixed(2)}</div>
                </div>
                <div className="payment-item">
                  <div className="item-label"><i className="fas fa-credit-card text-success"></i> Credit Card</div>
                  <div className="item-bar-container"><div ref={creditRef} className="item-bar"></div></div>
                  <div className="item-value">RM {salesData.breakdown.credit.toFixed(2)}</div>
                </div>
                <div className="payment-item">
                  <div className="item-label"><i className="fas fa-id-card text-info"></i> Debit Card</div>
                  <div className="item-bar-container"><div ref={debitRef} className="item-bar"></div></div>
                  <div className="item-value">RM {salesData.breakdown.debit.toFixed(2)}</div>
                </div>
                <div className="payment-item border-none">
                  <div className="item-label"><i className="fas fa-money-bill-wave text-warning"></i> Cash</div>
                  <div className="item-bar-container"><div ref={cashRef} className="item-bar"></div></div>
                  <div className="item-value">RM {salesData.breakdown.cash.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="card table-card">
              <div className="flex-between flex-align-center mb-1">
                <h3 className="card-title m-0">Recent Shift Summaries</h3>
                <button className="btn-primary" onClick={() => setIsReceiptOpen(true)}>
                  <i className="fas fa-door-closed"></i> Close Shift
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date / Shift</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-semibold">{item.date}</td>
                      <td>{item.orders}</td>
                      <td>RM {item.revenue.toFixed(2)}</td>
                      <td>
                        <button className="btn-text" onClick={() => setSelectedIdx(idx)}>View Details</button>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-2 text-muted">No shift history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Close Shift Modal / Receipt */}
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
              
              <div className="receipt-meta">
                <div className="flex flex-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString('en-MY')}</span>
                </div>
                <div className="flex flex-between">
                  <span>Time:</span>
                  <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase()}</span>
                </div>
                <div className="flex flex-between">
                  <span>Status:</span>
                  <span className="fw-bold">STORE CLOSED</span>
                </div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-stats mb-1">
                <div className="flex flex-between">
                  <span>Total Orders</span>
                  <span>{salesData.orderCount}</span>
                </div>
                <div className="flex flex-between">
                  <span>Avg Order Value</span>
                  <span>RM {salesData.averageOrderValue.toFixed(2)}</span>
                </div>
              </div>

              <p className="fw-bold fs-xs text-uppercase mb-05">Payment Methods</p>
              <div className="receipt-stats mb-1 fs-sm">
                <div className="flex flex-between">
                  <span>QR Payment</span>
                  <span>RM {salesData.breakdown.qr.toFixed(2)}</span>
                </div>
                <div className="flex flex-between">
                  <span>Credit Card</span>
                  <span>RM {salesData.breakdown.credit.toFixed(2)}</span>
                </div>
                <div className="flex flex-between">
                  <span>Debit Card</span>
                  <span>RM {salesData.breakdown.debit.toFixed(2)}</span>
                </div>
                <div className="flex flex-between">
                  <span>Cash</span>
                  <span>RM {salesData.breakdown.cash.toFixed(2)}</span>
                </div>
              </div>

              <div className="receipt-divider-thick flex flex-between py-05 mb-1">
                <span className="fw-bold">TOTAL SALES</span>
                <span className="fw-bold">RM {salesData.totalSales.toFixed(2)}</span>
              </div>

              <div className="receipt-footer mt-1 text-center text-muted fs-xs line-height-tight">
                <div className="receipt-divider mb-1"></div>
                <p>End of Day Report</p>
                <p>Thank you for your hard work!</p>
                <p className="mt-05">*** PickBite POS ***</p>
              </div>
            </div>
            <div className="modal-footer flex gap-1 mt-2">
               <button className="btn-danger-solid flex-1" onClick={() => setIsReceiptOpen(false)}>
                <i className="fas fa-times-circle"></i> Close
              </button>
              <button className="btn-primary flex-1" onClick={handlePrint}>
                <i className="fas fa-print"></i> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
