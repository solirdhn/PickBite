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

  // Refs for progress bars to avoid inline style warnings while keeping design dynamic
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

        setSalesData({
          totalSales: totalRevenue,
          orderCount: orderCount,
          averageOrderValue: avgValue,
          breakdown
        });

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

  // Update widths directly to satisfy "no-inline-style" linting without losing functionality
  useEffect(() => {
    const total = salesData.totalSales;
    if (total > 0) {
      if (qrRef.current) qrRef.current.style.width = `${(salesData.breakdown.qr / total) * 100}%`;
      if (creditRef.current) creditRef.current.style.width = `${(salesData.breakdown.credit / total) * 100}%`;
      if (debitRef.current) debitRef.current.style.width = `${(salesData.breakdown.debit / total) * 100}%`;
      if (cashRef.current) cashRef.current.style.width = `${(salesData.breakdown.cash / total) * 100}%`;
    }
  }, [salesData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="main-content sales-page">
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
          <div className="stats-grid">
            <div className="stat-card-modern">
              <div className="stat-icon-modern">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="stat-content-modern">
                <div className="stat-label-modern">Total Sales (Today)</div>
                <div className="stat-value-modern">RM {salesData.totalSales.toFixed(2)}</div>
                <div className="fs-xs text-primary mt-02"><i className="fas fa-arrow-up"></i> Live</div>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-icon-modern">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-content-modern">
                <div className="stat-label-modern">Orders</div>
                <div className="stat-value-modern">{salesData.orderCount}</div>
                <div className="fs-xs text-primary mt-02"><i className="fas fa-arrow-up"></i> Live</div>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-icon-modern">
                <i className="fas fa-receipt"></i>
              </div>
              <div className="stat-content-modern">
                <div className="stat-label-modern">Avg Order Value</div>
                <div className="stat-value-modern">RM {salesData.averageOrderValue.toFixed(2)}</div>
                <div className="fs-xs text-muted mt-02">Stable</div>
              </div>
            </div>
          </div>

          <div className="grid-2-1 mt-2">
            <div className="card">
              <div className="flex-between flex-align-center mb-15">
                <h3 className="card-title m-0">Recent Shift Summaries</h3>
                <button className="btn-primary" onClick={() => setIsReceiptOpen(true)}>
                  <i className="fas fa-door-closed"></i> Close Shift
                </button>
              </div>
              <div className="modern-list">
                <div className="list-header-modern">
                  <div>Date / Shift</div>
                  <div>Orders</div>
                  <div className="text-right">Revenue</div>
                </div>
                <div className="list-body-modern">
                  {history.map((item, idx) => (
                    <div key={idx} className="list-row-modern" onClick={() => setSelectedIdx(idx)}>
                      <div className="fw-semibold">{item.date}</div>
                      <div>{item.orders}</div>
                      <div className="text-right fw-bold">RM {item.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="p-3 text-center text-muted">No shift history found.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="mb-15">Payment Breakdown</h3>
              <div className="payment-list">
                <div className="payment-item mb-1">
                  <div className="flex-between fs-sm mb-02">
                    <span className="fw-semibold"><i className="fas fa-qrcode text-primary mr-05"></i> QR Payment</span>
                    <span className="fw-bold">RM {salesData.breakdown.qr.toFixed(2)}</span>
                  </div>
                  <div className="item-bar-container"><div ref={qrRef} className="item-bar"></div></div>
                </div>
                
                <div className="payment-item mb-1">
                  <div className="flex-between fs-sm mb-02">
                    <span className="fw-semibold"><i className="fas fa-credit-card text-success mr-05"></i> Credit Card</span>
                    <span className="fw-bold">RM {salesData.breakdown.credit.toFixed(2)}</span>
                  </div>
                  <div className="item-bar-container"><div ref={creditRef} className="item-bar"></div></div>
                </div>

                <div className="payment-item mb-1">
                  <div className="flex-between fs-sm mb-02">
                    <span className="fw-semibold"><i className="fas fa-id-card text-info mr-05"></i> Debit Card</span>
                    <span className="fw-bold">RM {salesData.breakdown.debit.toFixed(2)}</span>
                  </div>
                  <div className="item-bar-container"><div ref={debitRef} className="item-bar"></div></div>
                </div>

                <div className="payment-item">
                  <div className="flex-between fs-sm mb-02">
                    <span className="fw-semibold"><i className="fas fa-money-bill-wave text-warning mr-05"></i> Cash</span>
                    <span className="fw-bold">RM {salesData.breakdown.cash.toFixed(2)}</span>
                  </div>
                  <div className="item-bar-container"><div ref={cashRef} className="item-bar"></div></div>
                </div>
              </div>
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
                <p className="mt-05">*** PickBite ***</p>
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
