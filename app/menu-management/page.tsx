"use client";

import { useEffect, useState } from "react";

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
    if (savedMenu.length === 0) {
      const initialMenu = [
        { id: 1, name: "Nasi Lemak Special", category: "Main Course", price: 12.5, desc: "Fragrant rice with sambal, chicken, and egg.", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop", isPopular: true },
        { id: 2, name: "Teh Tarik Kaw", category: "Beverages", price: 3.5, desc: "Pulled milk tea, extra frothy.", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop", isPopular: true },
        { id: 3, name: "Satay Ayam (6 pcs)", category: "Main Course", price: 9.0, desc: "Grilled chicken skewers with peanut sauce.", image: "https://images.unsplash.com/photo-1514326640560-7d06307a0db4?w=500&auto=format&fit=crop", isPopular: true },
        { id: 4, name: "Mee Goreng Mamak", category: "Main Course", price: 8.5, desc: "Spicy stir-fried noodles with tofu and egg.", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop", isPopular: false },
        { id: 5, name: "Chicken Rice", category: "Main Course", price: 10.5, desc: "Hainanese style steamed chicken with rice.", image: "https://images.unsplash.com/photo-1626645738196-c2a0c87a9957?w=500&auto=format&fit=crop", isPopular: false },
        { id: 6, name: "Milo Dinosaur", category: "Beverages", price: 5.0, desc: "Iced Milo topped with extra Milo powder.", image: "/milo-dinosaur.png", isPopular: true },
        { id: 7, name: "Iced Lemon Tea", category: "Beverages", price: 4.0, desc: "Refreshing tea with a squeeze of fresh lemon.", image: "/iced-lemon-tea.png", isPopular: false },
        { id: 8, name: "Cendol", category: "Dessert", price: 4.5, desc: "Shaved ice with green jelly and coconut milk.", image: "/cendol.png", isPopular: false },
        { id: 9, name: "ABC (Air Batu Campur)", category: "Dessert", price: 6.0, desc: "Shaved ice with sweet syrup and toppings.", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop", isPopular: false },
        { id: 10, name: "Roti Canai", category: "Breakfast", price: 2.5, desc: "Crispy flatbread served with dhal.", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop", isPopular: true },
      ];
      setMenuItems(initialMenu);
      localStorage.setItem("pb_menu", JSON.stringify(initialMenu));
    } else {
      setMenuItems(savedMenu);
    }
  }, []);

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
      <div className="menu-header">
        <div>
          <h1>Your Restaurant Menu</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage food items, prices, and availability.</p>
        </div>
        <button className="btn-primary" onClick={() => { setIsModalOpen(true); setEditItem(null); }}>
          <i className="fas fa-plus"></i> Add New Item
        </button>
      </div>

      <div className="filter-bar">
        <i className="fas fa-search" style={{ color: "var(--text-muted)" }}></i>
        <input
          type="text"
          placeholder="Search food items..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-tabs-container">
        <div className="category-tabs">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`category-tab ${activeTab === cat ? "active" : ""}`}
              onClick={() => { setActiveTab(cat); setIsMoreOpen(false); }}
            >
              {cat}
            </div>
          ))}
        </div>
        <div className="more-menu-container">
          <button className="btn-more" onClick={() => setIsMoreOpen(!isMoreOpen)}>
            More <i className={`fas fa-chevron-${isMoreOpen ? "up" : "down"}`}></i>
          </button>
          <div className={`more-dropdown ${isMoreOpen ? "show" : ""}`}>
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

      <div className="food-grid">
        {filteredMenu.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            <i className="fas fa-search" style={{ fontSize: "3rem", opacity: 0.1 }}></i>
            <p style={{ marginTop: "1rem" }}>No items found matching your criteria.</p>
          </div>
        ) : (
          filteredMenu.map((item) => (
            <div key={item.id} className="card food-card">
              <img src={item.image || "https://via.placeholder.com/300x180?text=No+Image"} alt={item.name} className="food-image" />
              <div className="food-info">
                <span className="category">{item.category}</span>
                <h3>{item.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", height: "40px", overflow: "hidden" }}>{item.desc}</p>
              </div>
              <div className="food-footer">
                <span className="price">RM {parseFloat(item.price.toString()).toFixed(2)}</span>
                <div className="actions">
                  <button className="btn-icon" onClick={() => { setEditItem(item); setIsModalOpen(true); }}><i className="fas fa-edit"></i></button>
                  <button className="btn-icon btn-delete" onClick={() => deleteItem(item.id)}><i className="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: "1.5rem" }}>{editItem ? "Edit Food Item" : "Add New Food Item"}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Food Name</label>
                <input name="foodName" type="text" required defaultValue={editItem?.name} placeholder="e.g. Nasi Lemak Special" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="foodCategory" required defaultValue={editItem?.category || "Main Course"}>
                  <option value="Main Course">Main Course</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input name="isPopular" type="checkbox" defaultChecked={editItem?.isPopular} style={{ width: "auto" }} />
                <label style={{ marginBottom: 0 }}>Mark as Popular</label>
              </div>
              <div className="form-group">
                <label>Price (RM)</label>
                <input name="foodPrice" type="number" step="0.01" required defaultValue={editItem?.price} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="foodDesc" rows={3} defaultValue={editItem?.desc} placeholder="Describe the dish..."></textarea>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input name="foodImage" type="text" defaultValue={editItem?.image} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-primary" style={{ background: "transparent", color: "var(--text-muted)" }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
