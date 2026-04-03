"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  desc: string;
  image: string;
  isPopular?: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [basket, setBasket] = useState<Record<string, { item: MenuItem; quantity: number }>>({});
  const [showBasket, setShowBasket] = useState(false);
  const [orderType, setOrderType] = useState<'Dine In' | 'Take Away'>('Dine In');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch menu from the database
  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/products");
      const data = await resp.json();
      if (Array.isArray(data)) {
        // Map Prisma structure (with nested category) to our flat MenuItem structure
        setMenuItems(data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category.name,
          price: item.price,
          desc: item.desc || "",
          image: item.image || "",
          isPopular: item.isPopular
        })));
      }
    } catch (e) {
      console.error("Failed to load menu from backend:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Helpful utility to migrate old localStorage data to the new database
  const migrateLocalData = async () => {
    const localData = JSON.parse(localStorage.getItem("pb_menu_data") || "[]");
    if (localData.length === 0) {
      alert("No local data found to migrate.");
      return;
    }

    if (!confirm(`Found ${localData.length} items in your browser. Sync them to the cloud database?`)) return;

    setIsSyncing(true);
    try {
      for (const item of localData) {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: item.name,
            price: item.price,
            categoryName: item.category,
            desc: item.desc,
            image: item.image,
            isPopular: item.isPopular
          })
        });
      }
      alert("Migration complete! Your menu is now in the cloud.");
      fetchMenu();
    } catch (e) {
      alert("Migration failed. Please check your connection.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      id: editItem ? editItem.id : undefined,
      name: formData.get("foodName") as string,
      categoryName: formData.get("foodCategory") as string,
      price: parseFloat(formData.get("foodPrice") as string),
      desc: formData.get("foodDesc") as string,
      image: formData.get("foodImage") as string,
      isPopular: formData.get("isPopular") === "on",
    };

    try {
      const resp = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        setIsModalOpen(false);
        setEditItem(null);
        fetchMenu(); // Refresh from DB
      }
    } catch (e) {
      alert("Failed to save item to database.");
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this item from the database?")) {
      try {
        const resp = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
        if (resp.ok) fetchMenu();
      } catch (e) {
        alert("Failed to delete item.");
      }
    }
  };

  const addToBasket = (item: MenuItem) => {
    setBasket((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
    setShowBasket(true);
  };

  const removeFromBasket = (id: string) => {
    setBasket((prev) => {
      const newBasket = { ...prev };
      delete newBasket[id];
      return newBasket;
    });
  };

  const totalAmount = Object.values(basket).reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  const placeOrder = async () => {
    if (Object.values(basket).length === 0) return;

    const payload = {
      customerName: "Counter Customer",
      orderType: orderType,
      total: totalAmount,
      paymentMethod: paymentMethod,
      status: "Pending",
      items: Object.values(basket).map(entry => ({
        productId: entry.item.id,
        name: entry.item.name,
        quantity: entry.quantity,
        price: entry.item.price
      }))
    };

    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        const result = await resp.json();
        setSuccessOrder(`Order #${result.orderNumber}`); // Beautiful sequential ID
        setBasket({});
        
        setTimeout(() => {
          setSuccessOrder(null);
          setShowBasket(false);
          setPaymentMethod(null);
        }, 5000);
      }
    } catch (e) {
      alert("Failed to place order in database.");
    }
  };

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory =
      activeTab === "Popular" ? item.isPopular :
        activeTab === "All" ? true :
          item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Popular", "Beverages", "Main Course", "Dessert"];
  const moreCategories = ["Breakfast"];

  return (
    <main className="main-content menu-page">
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
        <section className="welcome-section flex-1">
          <div className="flex flex-between flex-align-center">
            <div>
              <h1>Your Restaurant Menu</h1>
              <p className="text-muted">Manage food items, prices, and availability.</p>
            </div>
            {/* Migration Button - Only shows if there is local data to sync */}
            <button 
              className={`btn-primary btn-ghost fs-xs py-05 ${isSyncing ? 'opacity-50' : ''}`}
              onClick={migrateLocalData}
              disabled={isSyncing}
            >
              <i className={`fas ${isSyncing ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i> 
              {isSyncing ? ' Syncing...' : ' Sync Local to Cloud'}
            </button>
          </div>
        </section>
      </div>

      <div className="menu-main-content-layout">
        <div className="menu-main-column">
          <div className="search-section-horizontal flex flex-align-center gap-1">
            <div className="filter-bar full-width-search flex-1">
              <i className="fas fa-search text-muted"></i>
              <input
                type="text"
                placeholder="Search food items..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search food items"
              />
            </div>
            <button className="btn-primary" onClick={() => { setIsModalOpen(true); setEditItem(null); }}>
              <i className="fas fa-plus"></i> Add New Item
            </button>
          </div>

          <hr className="menu-divider m-0 mb-2" />

          {isLoading ? (
            <div className="flex-center py-5 text-muted">
              <i className="fas fa-spinner fa-spin fs-xl mr-1"></i> Loading your menu...
            </div>
          ) : (
            <div className="food-grid">
              {filteredMenu.length === 0 ? (
                <div className="p-3 text-center text-muted grid-all">
                  <i className="fas fa-search fs-xl opacity-10"></i>
                  <p className="mt-1">No items found matching your criteria.</p>
                </div>
              ) : (
                filteredMenu.map((item) => (
                  <div key={item.id} className="card food-card">
                    <img src={item.image || "https://via.placeholder.com/300x180?text=No+Image"} alt={item.name} className="food-image" />
                    <div className="food-info">
                      <span className="category">{item.category}</span>
                      <h3>{item.name}</h3>
                      <p className="fs-sm text-muted h-40 overflow-hidden">{item.desc}</p>
                    </div>
                    <div className="food-footer">
                      <span className="price">RM {parseFloat(item.price.toString()).toFixed(2)}</span>
                      <div className="actions">
                        <button className="btn-icon" onClick={() => addToBasket(item)} aria-label="Quick Order" title="Add to Order (Take Away)">
                          <i className="fas fa-shopping-basket"></i>
                        </button>
                        <button className="btn-icon" onClick={() => { setEditItem(item); setIsModalOpen(true); }} aria-label="Edit Item" title="Edit Item"><i className="fas fa-edit"></i></button>
                        <button className="btn-icon btn-delete" onClick={() => deleteItem(item.id)} aria-label="Delete Item" title="Delete Item"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <aside className="menu-sidebar-right">
          {!showBasket ? (
            <>
              <h4 className="sidebar-title">Categories</h4>
              <div className="category-vertical-tabs">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`category-vertical-tab ${activeTab === cat ? "active" : ""}`}
                    onClick={() => { setActiveTab(cat); setIsMoreOpen(false); }}
                  >
                    {cat}
                  </div>
                ))}
                <div className="more-menu-container w-full">
                  <button className="btn-more w-full" onClick={() => setIsMoreOpen(!isMoreOpen)}>
                    More <i className={`fas fa-chevron-${isMoreOpen ? "up" : "down"}`}></i>
                  </button>
                  <div className={`more-dropdown vertical ${isMoreOpen ? "show" : ""}`}>
                    {moreCategories.map((cat) => (
                      <button
                        key={cat}
                        className="dropdown-item"
                        onClick={() => {
                          setActiveTab(cat);
                          setIsMoreOpen(false);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="basket-view p-05">
              <div className="flex flex-column mb-1 pb-05 border-bottom">
                <div className="flex flex-between flex-align-center mb-05">
                  <button className="btn-text fs-xs flex-align-center gap-02 p-0" onClick={() => setShowBasket(false)}>
                    <i className="fas fa-arrow-left"></i> Categories
                  </button>
                  <button className="btn-icon btn-ghost p-0" onClick={() => setShowBasket(false)} title="Close Basket">
                    <i className="fas fa-times fs-sm"></i>
                  </button>
                </div>
                <h4 className="sidebar-title m-0 fs-md">Order Basket</h4>
              </div>
              
              <div className="basket-items mb-15">
                {Object.values(basket).length === 0 ? (
                  <p className="text-center text-muted py-2 fs-sm">Basket is empty</p>
                ) : (
                  <div className="basket-list">
                    {Object.values(basket).map((entry) => (
                      <div key={entry.item.id} className="basket-item flex flex-between mb-05 pb-05 border-bottom flex-align-start">
                        <div className="basket-item-info flex-1 pr-05">
                          <div className="fs-sm fw-semibold text-dark line-height-tight">{entry.item.name}</div>
                          <div className="text-muted fs-xs">Qty: {entry.quantity}</div>
                        </div>
                        <div className="basket-item-actions flex flex-align-center gap-05">
                          <span className="fs-xs fw-bold">RM {(entry.item.price * entry.quantity).toFixed(2)}</span>
                          <button 
                            className="btn-icon-xs text-danger" 
                            onClick={() => removeFromBasket(entry.item.id)} 
                            title="Remove"
                          >
                            <i className="fas fa-trash fs-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="basket-summary pt-1">
                {successOrder ? (
                  <div className="success-message-basket">
                    <i className="fas fa-check-circle"></i>
                    <p className="fw-bold">{successOrder} is placed</p>
                    <button className="btn-text fs-xs mt-05" onClick={() => { setSuccessOrder(null); setShowBasket(false); }}>
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="order-type-toggle flex gap-05 mb-1">
                      <button 
                        className={`btn-primary flex-1 py-05 fs-xs ${orderType === 'Take Away' ? '' : 'btn-ghost'}`}
                        onClick={() => setOrderType('Take Away')}
                      >
                        Take Away
                      </button>
                      <button 
                        className={`btn-primary flex-1 py-05 fs-xs ${orderType === 'Dine In' ? '' : 'btn-ghost'}`}
                        onClick={() => setOrderType('Dine In')}
                      >
                        Dine In
                      </button>
                    </div>

                    <div className="flex flex-between fw-bold fs-md mb-05">
                      <span>Total</span>
                      <span className="text-primary">RM {totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="payment-selection mb-1">
                      <div className="fs-xs fw-bold text-muted text-uppercase mb-05">Payment Method</div>
                      <div className="payment-grid-modern">
                        {[
                          { id: 'qr', label: 'QR', icon: 'fa-qrcode' },
                          { id: 'credit', label: 'Credit', icon: 'fa-credit-card' },
                          { id: 'debit', label: 'Debit', icon: 'fa-id-card' },
                          { id: 'cash', label: 'Cash', icon: 'fa-money-bill-wave' }
                        ].map((method) => (
                          <button
                            key={method.id}
                            className={`btn-payment-method ${paymentMethod === method.id ? 'active' : ''}`}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <i className={`fas ${method.icon}`}></i>
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-column gap-05">
                      <button 
                        className="btn-primary btn-primary-order-place" 
                        onClick={placeOrder} 
                        disabled={Object.values(basket).length === 0 || !paymentMethod}
                      >
                        Place Order
                      </button>
                      <button className="btn-primary btn-ghost w-full py-05 fs-xs" onClick={() => setBasket({})} disabled={Object.values(basket).length === 0}>
                        Clear Basket
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="mb-15">{editItem ? "Edit Food Item" : "Add New Food Item"}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="foodName">Food Name</label>
                <input id="foodName" name="foodName" type="text" required defaultValue={editItem?.name} placeholder="e.g. Nasi Lemak" />
              </div>
              <div className="form-group">
                <label htmlFor="foodCategory">Category</label>
                <select id="foodCategory" name="foodCategory" required defaultValue={editItem?.category || "Main Course"} title="Select Category">
                  <option value="Main Course">Main Course</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div className="form-group flex-align-center gap-05">
                <input id="isPopular" name="isPopular" type="checkbox" defaultChecked={editItem?.isPopular} className="w-auto" title="Mark as Popular" />
                <label htmlFor="isPopular" className="mb-0">Mark as Popular</label>
              </div>
              <div className="form-group">
                <label htmlFor="foodPrice">Price (RM)</label>
                <input id="foodPrice" name="foodPrice" type="number" step="0.01" required defaultValue={editItem?.price} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label htmlFor="foodDesc">Description</label>
                <textarea id="foodDesc" name="foodDesc" rows={3} defaultValue={editItem?.desc} placeholder="Describe the dish..."></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="foodImage">Image URL</label>
                <input id="foodImage" name="foodImage" type="text" defaultValue={editItem?.image} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-primary btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
