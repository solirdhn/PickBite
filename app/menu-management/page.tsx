"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  image: string;
  isPopular?: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState("Popular");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const savedMenu = JSON.parse(localStorage.getItem("pb_menu") || "[]");
    const menuVersion = localStorage.getItem("pb_menu_version");
    const CURRENT_VERSION = "1.3"; // Increment this when updating initialMenu

    if (savedMenu.length === 0 || menuVersion !== CURRENT_VERSION) {
      const initialMenu = [
        { id: 1, name: "Nasi Lemak", category: "Main Course", price: 12.5, desc: "Fragrant rice with sambal, chicken, and egg.", image: "https://www.healthygfasian.com/wp-content/uploads/2023/08/GF-Nasi-Lemak.jpg", isPopular: true },
        { id: 2, name: "Teh Tarik Kaw", category: "Beverages", price: 3.5, desc: "Pulled milk tea, extra frothy.", image: "https://thesmartlocal.my/wp-content/uploads/2025/04/TEH-TARIK-1.jpg", isPopular: true },
        { id: 3, name: "Satay Ayam (6 pcs)", category: "Main Course", price: 9.0, desc: "Grilled chicken skewers with peanut sauce.", image: "https://i.ytimg.com/vi/20Twt_s9Jh8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBBSaj6BOBTJwP4jIqurtud_zcBOA", isPopular: true },
        { id: 4, name: "Mee Goreng Mamak", category: "Main Course", price: 8.5, desc: "Spicy stir-fried noodles with tofu and egg.", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop", isPopular: false },
        { id: 5, name: "Chicken Rice", category: "Main Course", price: 10.5, desc: "Hainanese style steamed chicken with rice.", image: "https://images.deliveryhero.io/image/fd-my/LH/v4un-listing.jpg", isPopular: false },
        { id: 6, name: "Milo Dinosaur", category: "Beverages", price: 5.0, desc: "Iced Milo topped with extra Milo powder.", image: "https://www.wandercooks.com/wp-content/uploads/2023/03/malaysian-milo-dinosaur-3-683x1024.jpg", isPopular: true },
        { id: 7, name: "Iced Lemon Tea", category: "Beverages", price: 4.0, desc: "Refreshing tea with a squeeze of fresh lemon.", image: "https://aromaticessence.co/wp-content/uploads/2016/03/image55.jpeg", isPopular: false },
        { id: 8, name: "Cendol", category: "Dessert", price: 4.5, desc: "Shaved ice with green jelly and coconut milk.", image: "https://www.saveur.com/uploads/2019/04/01/7SD4OZMRAULKZD6Q7HO6XSBJVY.jpg?auto=webp", isPopular: false },
        { id: 9, name: "ABC (Air Batu Campur)", category: "Dessert", price: 6.0, desc: "Shaved ice with sweet syrup and toppings.", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop", isPopular: false },
        { id: 10, name: "Roti Canai", category: "Breakfast", price: 2.5, desc: "Crispy flatbread served with dhal.", image: "https://www.rotinrice.com/wp-content/uploads/2011/04/RotiCanai-1.jpg", isPopular: true },
      ];
      setMenuItems(initialMenu);
      localStorage.setItem("pb_menu", JSON.stringify(initialMenu));
      localStorage.setItem("pb_menu_version", CURRENT_VERSION);
    } else {
      setMenuItems(savedMenu);
    }
  }, []);

  const resetMenu = () => {
    if (confirm("This will reset your menu to the default items. All your custom changes will be lost. Proceed?")) {
      localStorage.removeItem("pb_menu");
      localStorage.removeItem("pb_menu_version");
      window.location.reload();
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: MenuItem = {
      id: editItem ? editItem.id : Date.now(),
      name: formData.get("foodName") as string,
      category: formData.get("foodCategory") as string,
      price: parseFloat(formData.get("foodPrice") as string),
      desc: formData.get("foodDesc") as string,
      image: formData.get("foodImage") as string,
      isPopular: formData.get("isPopular") === "on",
    };

    let updated;
    if (editItem) {
      updated = menuItems.map((i) => (i.id === editItem.id ? newItem : i));
    } else {
      updated = [...menuItems, newItem];
    }

    setMenuItems(updated);
    localStorage.setItem("pb_menu", JSON.stringify(updated));
    setIsModalOpen(false);
    setEditItem(null);
  };

  const deleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updated = menuItems.filter((i) => i.id !== id);
      setMenuItems(updated);
      localStorage.setItem("pb_menu", JSON.stringify(updated));
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

  const categories = ["Popular", "Beverages", "Main Course", "Dessert"];
  const moreCategories = ["Breakfast", "All"];

  return (
    <main className="main-content">
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
        <div className="welcome-section">
          <div className="flex flex-align-center gap-2 mb-1">
            <div>
              <h1>Your Restaurant Menu</h1>
              <p className="text-muted">Manage food items, prices, and availability.</p>
            </div>
            <div className="flex gap-1 flex-align-center">
              <button className="btn-primary" onClick={() => { setIsModalOpen(true); setEditItem(null); }}>
                <i className="fas fa-plus"></i> Add New Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="search-section-horizontal">
        <div className="filter-bar full-width-search">
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
      </div>

      <hr className="menu-divider" />

      <div className="menu-main-content-layout">
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
                    <button className="btn-icon" onClick={() => { setEditItem(item); setIsModalOpen(true); }} aria-label="Edit Item" title="Edit Item"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon btn-delete" onClick={() => deleteItem(item.id)} aria-label="Delete Item" title="Delete Item"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="menu-sidebar-right">
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
