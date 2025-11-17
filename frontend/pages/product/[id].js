// pages/product/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:8080"; // change if your backend URL differs

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // product id from URL
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    sku: "",
    category: "",
    supplier: "",
    costPrice: "",
    sellingPrice: "",
    reorderPoint: "",
    reorderQuantity: "",
  });

  // Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null);
        setLoadingAuth(false);
        router.replace("/login");
      } else {
        setUser(u);
        setLoadingAuth(false);
      }
    });
    return () => unsub();
  }, [router]);

  // Fetch product when we have id and user
  useEffect(() => {
    const load = async () => {
      if (!id || !user) return;
      // load data
      setLoadingData(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // if product not found or unauthorized
          throw new Error(`Failed to fetch (${res.status})`);
        }
        const data = await res.json();
        // map DB fields into our form (some names may differ depending on your schema)
        setForm({
          name: data.name || "",
          description: data.description || "",
          quantity: data.quantity ?? 0,
          sku: data.sku || "",
          category: data.category || "",
          supplier: data.supplier || "",
          costPrice: data.costPrice != null ? String(data.costPrice) : "",
          sellingPrice: data.sellingPrice != null ? String(data.sellingPrice) : "",
          reorderPoint: data.reorderPoint != null ? String(data.reorderPoint) : "",
          reorderQuantity: data.reorderQuantity != null ? String(data.reorderQuantity) : "",
        });
      } catch (err) {
        console.error("Error loading product:", err);
        alert("Failed to load product. You may not have access or the product does not exist.");
        router.push("/products");
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [id, user, router]);

  // convenient form change
  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Save handler (PUT)
  const handleSave = async (e) => {
    e?.preventDefault();
    if (!user) return alert("Not authenticated");

    // Basic validation
    if (!form.name.trim()) return alert("Product name required");

    setSaving(true);
    try {
      const token = await user.getIdToken();
      // send only relevant fields to backend
      const payload = {
        name: form.name.trim(),
        description: form.description,
        quantity: Number(form.quantity) || 0,
        sku: form.sku,
        category: form.category,
        supplier: form.supplier,
        costPrice: form.costPrice ? Number(form.costPrice) : 0,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : 0,
        reorderPoint: form.reorderPoint ? Number(form.reorderPoint) : 0,
        reorderQuantity: form.reorderQuantity ? Number(form.reorderQuantity) : 0,
      };

      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Update failed (${res.status})`);
      }

      alert("✅ Product saved");
      router.push("/products");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save product: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  // Cancel => go back to products
  const handleCancel = (e) => {
    e?.preventDefault();
    router.push("/products");
  };

  // Go to ML dashboard - placeholder, ML team will provide actual URL
  const handleGoToDashboard = (e) => {
    e?.preventDefault();
    // if ML dashboard link known, use window.location.href = mlUrl
    // For now show message
    alert("ML dashboard link not provided yet. We'll wire redirect + token validation later.");
  };

  if (loadingAuth || loadingData) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f9" }}>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ maxWidth: 980, margin: "28px auto", padding: 20 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28 }}>Product Details</h1>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>View and update detailed information about the product.</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleGoToDashboard}
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "10px 14px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ background: "white", padding: 22, borderRadius: 8, boxShadow: "0 6px 20px rgba(13,18,28,0.06)" }}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Product Name</label>
            <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Premium Wireless Headphones" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="A short description of the product." style={textareaStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input type="number" value={form.quantity} onChange={(e) => updateField("quantity", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>SKU</label>
              <input value={form.sku} onChange={(e) => updateField("sku", e.target.value)} placeholder="WH-12345" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <input value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Electronics" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Supplier</label>
              <input value={form.supplier} onChange={(e) => updateField("supplier", e.target.value)} placeholder="Supplier Inc." style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Cost Price</label>
              <input type="number" value={form.costPrice} onChange={(e) => updateField("costPrice", e.target.value)} placeholder="$ 0.00" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Selling Price</label>
              <input type="number" value={form.sellingPrice} onChange={(e) => updateField("sellingPrice", e.target.value)} placeholder="$ 0.00" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Reorder Point</label>
              <input type="number" value={form.reorderPoint} onChange={(e) => updateField("reorderPoint", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Reorder Quantity</label>
              <input type="number" value={form.reorderQuantity} onChange={(e) => updateField("reorderQuantity", e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={handleCancel} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={saving} style={saveBtnStyle}>{saving ? "Saving…" : "Save Product"}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* inline styles to keep the example self-contained */
const labelStyle = { display: "block", marginBottom: 6, color: "#374151", fontWeight: 600 };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e6e9ee", fontSize: 14 };
const textareaStyle = { width: "100%", minHeight: 100, padding: "10px 12px", borderRadius: 8, border: "1px solid #e6e9ee", fontSize: 14, resize: "vertical" };
const cancelBtnStyle = { background: "transparent", border: "1px solid #d1d5db", padding: "8px 12px", borderRadius: 8, cursor: "pointer" };
const saveBtnStyle = { background: "#10b981", color: "white", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer" };