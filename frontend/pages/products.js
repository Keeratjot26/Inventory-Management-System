import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import styles from "../styles/products.module.css";
import {
  GET_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  GET_SALES,
  ADD_SALE,
} from "../endpoints";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("products");

  // Products
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState(null);

  // Sales
  const [sales, setSales] = useState([]);
  const [saleProduct, setSaleProduct] = useState("");
  const [saleQuantity, setSaleQuantity] = useState("");
  const [saleDate, setSaleDate] = useState("");
  // Removed: editSaleId

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) router.push("/login");
      else {
        setUser(currentUser);
        await fetchProducts(currentUser);
        await fetchSales(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ======================
  // PRODUCTS HANDLERS
  // ======================
  const fetchProducts = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(GET_PRODUCTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("❌ Failed to fetch products");
    }
  };

  const handleSaveProduct = async () => {
    if (!name.trim() || quantity === "" || !user) {
      toast.error("⚠️ Name and quantity required");
      return;
    }

    try {
      const token = await user.getIdToken();
      const productData = { name: name.trim(), quantity: Number(quantity) };
      const url = editId ? UPDATE_PRODUCT(editId) : ADD_PRODUCT;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Failed to save");
      await fetchProducts(user);
      setName("");
      setQuantity("");
      setEditId(null);
      toast.success(editId ? "✅ Product updated!" : "✅ Product added!");
    } catch {
      toast.error("❌ Failed to save product");
    }
  };

  const handleEditProduct = (p) => {
    setName(p.name);
    setQuantity(p.quantity);
    setEditId(p._id);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = await user.getIdToken();
      await fetch(DELETE_PRODUCT(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProducts(user);
      toast.success("🗑️ Product deleted");
    } catch {
      toast.error("❌ Failed to delete product");
    }
  };

  // ======================
  // SALES HANDLERS
  // ======================
  const fetchSales = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(GET_SALES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch {
      toast.error("❌ Failed to fetch sales");
    }
  };

  const handleSaveSale = async () => {
    if (!saleProduct.trim() || saleQuantity === "" || !saleDate || !user) {
      toast.error("⚠️ All fields required");
      return;
    }

    try {
      const token = await user.getIdToken();
      const saleData = {
        // Use 'product' as the key to match the backend route's expected name
        product: saleProduct.trim(), 
        quantity: Number(saleQuantity),
        date: saleDate,
      };
      
      const res = await fetch(ADD_SALE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saleData),
      });

      if (!res.ok) {
        // Attempt to read the error message from the backend (e.g., "Not enough stock")
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to record sale due to server issue."); 
      }

      await fetchSales(user);
      setSaleProduct("");
      setSaleQuantity("");
      setSaleDate("");
      toast.success("✅ Sale added!"); 
      
    } catch (error) { 
      // Display the specific error message, which is now coming from the backend's response body
      toast.error(`❌ Failed to save sale: ${error.message}`);
    }
  };

  // Removed: handleEditSale function
  // Removed: handleDeleteSale function

  if (loading) return <p className={styles.loading}>⏳ Loading your data...</p>;

  return (
    <div className={styles.productsPage}>
      <Navbar />
      <Toaster position="top-right" />

      <motion.div
        className={styles.productsCard}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* --- Tabs --- */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "products" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            📦 Products
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "sales" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("sales")}
          >
            💰 Sales
          </button>
        </div>

        {/* ======================= PRODUCTS TAB (UNCHANGED) ======================= */}
        {activeTab === "products" && (
          <>
            <h1 className={styles.productsTitle}>📦 Product Details</h1>
            <p className={styles.productsSubtitle}>
              View and manage your products easily.
            </p>

            <div className={styles.formRow}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label>Product Name</label>
              </div>

              <div className={`${styles.inputContainer} ${styles.inputSmall}`}>
                <input
                  type="number"
                  placeholder=" "
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <label>Quantity</label>
              </div>
            </div>

            <div className={styles.btnGroup}>
              <button onClick={handleSaveProduct} className={styles.btnPrimary}>
                {editId ? "Update Product" : "Save Product"}
              </button>
              {editId && (
                <button
                  onClick={() => {
                    setEditId(null);
                    setName("");
                    setQuantity("");
                  }}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
              )}
            </div>

            <h2 className={styles.productsSubHeading}>Your Products</h2>
            <ul className={styles.productList}>
              {products.length > 0 ? (
                products.map((p) => (
                  <li key={p._id} className={styles.productItem}>
                    <span>
                      {p.name} —{" "}
                      <span className={styles.qty}>{p.quantity}</span>
                    </span>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEditProduct(p)}
                        className={styles.btnEdit}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className={styles.btnDelete}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className={styles.empty}>No products found</li>
              )}
            </ul>
          </>
        )}

        {/* ======================= SALES TAB (MODIFIED) ======================= */}
        {activeTab === "sales" && (
          <>
            <h1 className={styles.productsTitle}>💰 Sales Details</h1>
            <p className={styles.productsSubtitle}>
              Record and view your product sales.
            </p>

            <div className={styles.formRow}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder=" "
                  value={saleProduct}
                  onChange={(e) => setSaleProduct(e.target.value)}
                />
                <label>Product Name</label>
              </div>

              <div className={`${styles.inputContainer} ${styles.inputSmall}`}>
                <input
                  type="number"
                  placeholder=" "
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(e.target.value)}
                />
                <label>Quantity Sold</label>
              </div>

              <div className={`${styles.inputContainer} ${styles.inputSmall}`}>
                <input
                  type="date"
                  placeholder=" "
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
                <label>Date</label>
              </div>
            </div>

            <div className={styles.btnGroup}>
              <button onClick={handleSaveSale} className={styles.btnPrimary}>
                Save Sale
              </button>
            </div>

            <h2 className={styles.productsSubHeading}>Your Sales</h2>
            <ul className={styles.productList}>
              {sales.length > 0 ? (
                sales.map((s) => (
                  <li key={s._id} className={styles.productItem}>
                    <span>
                      {/* Use productName and quantitySold which are saved in the backend */}
                      {s.productName || s.product} —{" "}
                      <span className={styles.qty}>{s.quantitySold}</span> on{" "}
                      {new Date(s.date).toLocaleDateString()}
                    </span>
                    {/* Removed Edit and Delete buttons */}
                  </li>
                ))
              ) : (
                <li className={styles.empty}>No sales found</li>
              )}
            </ul>
          </>
        )}
      </motion.div>
    </div>
  );
}