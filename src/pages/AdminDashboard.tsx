import React, { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingBag, Calendar, Users, Star, Image, LogOut, Plus, Edit2, Trash2, CheckCircle, Package, Settings as SettingsIcon, Save } from "lucide-react";
import { Link, useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import axios from "axios";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user?.role !== "admin") {
    return (
      <div className="pt-40 text-center min-h-screen">
        <h1 className="text-4xl font-serif mb-8 text-red-500">ACCESS DENIED</h1>
        <Link to="/" className="luxury-button">Back to Home</Link>
      </div>
    );
  }

  const sidebarLinks = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: ShoppingBag },
    { name: "Orders", path: "/admin/orders", icon: Package },
    { name: "Bookings", path: "/admin/bookings", icon: Calendar },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Settings", path: "/admin/settings", icon: SettingsIcon },
    { name: "Gallery", path: "/admin/gallery", icon: Image },
    { name: "Pages", path: "/admin/pages", icon: Edit2 },
    { name: "Testimonial", path: "/admin/testimonials", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-luxury-black pt-24 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/5 h-[calc(100vh-6rem)] sticky top-24 hidden lg:block">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center font-bold text-luxury-black">
              {user.name[0]}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">{user.name}</p>
              <p className="text-[10px] text-luxury-gold uppercase font-bold tracking-tighter">Administrator</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-none text-xs uppercase tracking-widest font-bold transition-all ${isActive ? "bg-luxury-gold text-luxury-black" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-4 px-4 py-4 rounded-none text-xs uppercase tracking-widest font-bold text-red-500 hover:bg-white/5 transition-all mt-10"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/bookings" element={<AdminBookings />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/reviews" element={<AdminReviews />} />
          <Route path="/settings" element={<WebsiteSettings />} />
          <Route path="/gallery" element={<AdminGallery />} />
          <Route path="/pages" element={<AdminPages />} />
          <Route path="/testimonials" element={<AdminTestimonials />} />
        </Routes>
      </main>
    </div>
  );
}

function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ caption: "", category: "" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("/api/gallery");
    setItems(res.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");
    setLoading(true);
    const data = new FormData();
    data.append("image", file);
    data.append("caption", newItem.caption);
    data.append("category", newItem.category);

    try {
      await axios.post("/api/admin/gallery", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchItems();
      setNewItem({ caption: "", category: "" });
      setFile(null);
    } catch (err) {
      alert("Failed to add gallery item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await axios.delete(`/api/admin/gallery/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchItems();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-serif">GALLERY MANAGEMENT</h2>
      
      <form onSubmit={handleAdd} className="bg-white/5 border border-white/5 p-8 max-w-2xl space-y-6">
        <h3 className="text-xs uppercase tracking-widest font-bold text-luxury-gold mb-6 border-b border-white/10 pb-4">Add New Piece</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Caption</label>
            <input value={newItem.caption} onChange={e => setNewItem({ ...newItem, caption: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Category</label>
            <input value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Image</label>
            <input type="file" onChange={e => e.target.files && setFile(e.target.files[0])} className="text-xs" />
          </div>
        </div>
        <button disabled={loading} className="luxury-button w-full">
          {loading ? "ADDING..." : "ADD TO GALLERY"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map(item => (
          <div key={item._id} className="relative aspect-square group overflow-hidden bg-white/5">
            <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <button 
                onClick={() => handleDelete(item._id)}
                className="self-end p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 size={12} />
              </button>
              <div className="bg-luxury-gold/10 p-2 border-l border-luxury-gold">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white">{item.caption}</p>
                <p className="text-[8px] uppercase tracking-tighter text-luxury-gold font-bold">{item.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPages() {
  const [slug, setSlug] = useState("about");
  const [formData, setFormData] = useState<any>({ title: "", content: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const res = await axios.get(`/api/pages/${slug}`);
      if (res.data) setFormData(res.data);
      else setFormData({ title: "", content: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (file) data.append("image", file);

    try {
      await axios.put(`/api/admin/pages/${slug}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Page updated");
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-serif">PAGE EDITOR</h2>
      <div className="flex space-x-4">
        {["about", "contact", "privacy"].map(s => (
          <button 
            key={s} 
            onClick={() => setSlug(s)}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${slug === s ? "bg-luxury-gold text-luxury-black border-luxury-gold" : "text-gray-500 border-white/10"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="bg-white/5 border border-white/5 p-8 max-w-4xl space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Page Title</label>
          <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Content</label>
          <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={10} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-luxury-gold leading-relaxed" />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Featured Image</label>
          {formData.image && <img src={formData.image} className="w-40 h-40 object-cover mb-4" />}
          <input type="file" onChange={e => e.target.files && setFile(e.target.files[0])} className="text-xs" />
        </div>
        <button disabled={loading} className="luxury-button w-full">
          {loading ? "SAVING..." : "SAVE PAGE"}
        </button>
      </form>
    </div>
  );
}

function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", role: "", content: "", rating: 5 });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("/api/testimonials");
    setItems(res.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    if (file) data.append("image", file);
    data.append("name", newItem.name);
    data.append("role", newItem.role);
    data.append("content", newItem.content);
    data.append("rating", String(newItem.rating));

    try {
      await axios.post("/api/admin/testimonials", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchItems();
      setNewItem({ name: "", role: "", content: "", rating: 5 });
      setFile(null);
    } catch (err) {
      alert("Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await axios.delete(`/api/admin/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchItems();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-serif">TESTIMONIALS MANAGEMENT</h2>
      
      <form onSubmit={handleAdd} className="bg-white/5 border border-white/5 p-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Name</label>
            <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Role</label>
            <input value={newItem.role} onChange={e => setNewItem({ ...newItem, role: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Content</label>
          <textarea value={newItem.content} onChange={e => setNewItem({ ...newItem, content: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
        </div>
        <button disabled={loading} className="luxury-button w-full">
          {loading ? "ADDING..." : "ADD TESTIMONIAL"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold uppercase tracking-widest text-[10px]">
        {items.map(item => (
          <div key={item._id} className="bg-white/5 border border-white/5 p-8 space-y-6 relative group">
            <div className="flex justify-between items-center text-luxury-gold">
              <span>{item.name}</span>
              <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
            <p className="text-gray-400 italic font-normal tracking-normal lowercase first-letter:uppercase">"{item.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// SUB-COMPONENTS
function Overview() {
  const stats = [
    { name: "Total Revenue", value: "$45,290", icon: ShoppingBag, color: "text-green-500" },
    { name: "Orders Pending", value: "24", icon: Package, color: "text-luxury-gold" },
    { name: "New Bookings", value: "12", icon: Calendar, color: "text-blue-500" },
    { name: "Client Reviews", value: "158", icon: Star, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-luxury-gold text-xs uppercase tracking-widest font-bold block mb-2">Master Console</span>
          <h2 className="text-4xl font-serif">OVERVIEW</h2>
        </div>
        <div className="text-xs uppercase tracking-widest font-bold text-gray-500">Last updated: Today, 2:30 PM</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.name} className="bg-white/5 border border-white/5 p-8 space-y-6">
            <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">{s.name}</p>
              <p className="text-3xl font-serif font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/5 p-8">
          <h3 className="text-xs uppercase tracking-widest font-bold mb-8 text-luxury-gold">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-widest">
              <thead>
                <tr className="text-gray-500 border-b border-white/5">
                  <th className="pb-4 font-bold">ID</th>
                  <th className="pb-4 font-bold">Customer</th>
                  <th className="pb-4 font-bold">Amount</th>
                  <th className="pb-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1,2,3,4].map(i => (
                  <tr key={i} className="group">
                    <td className="py-4 text-gray-400">#ORD-450{i}</td>
                    <td className="py-4 font-bold italic">Michael Obi</td>
                    <td className="py-4 text-luxury-gold">$1,450</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] rounded leading-none">Delivered</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-8">
          <h3 className="text-xs uppercase tracking-widest font-bold mb-8 text-luxury-gold">Latest Bookings</h3>
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-start space-x-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-white/10 flex-shrink-0 flex items-center justify-center text-xs font-bold italic">SJ</div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest uppercase">Sarah Johnson</h4>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase">Wedding Gown Consultation</p>
                  <p className="text-[10px] text-luxury-gold mt-2 font-bold italic">Oct 24, 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", category: "Men's Wears", stock: ""
  });
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    axios.get("/api/products").then(res => setProducts(res.data));
  }, []);

  const handleAddProduct = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(newProduct).forEach(([k, v]) => data.append(k, String(v)));
    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }
    }
    
    try {
      await axios.post("/api/products", data);
      setShowModal(false);
      // Reload
      window.location.reload();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-luxury-gold text-xs uppercase tracking-widest font-bold block mb-2">Vault</span>
          <h2 className="text-4xl font-serif text-white">COLLECTION MANAGEMENT</h2>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="luxury-button flex items-center space-x-3"
        >
          <Plus size={18} />
          <span>NEW PRODUCT</span>
        </button>
      </div>

      <div className="bg-white/5 border border-white/5 overflow-hidden">
        <table className="w-full text-left text-xs uppercase tracking-widest">
          <thead className="bg-white/5 text-gray-500">
            <tr>
              <th className="p-6 font-bold">Image</th>
              <th className="p-6 font-bold">Product</th>
              <th className="p-6 font-bold">Category</th>
              <th className="p-6 font-bold">Price</th>
              <th className="p-6 font-bold">Stock</th>
              <th className="p-6 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <img src={p.images?.[0]} className="w-12 h-16 object-cover" alt="" />
                </td>
                <td className="p-6 font-bold italic">{p.name}</td>
                <td className="p-6">{p.category}</td>
                <td className="p-6 text-luxury-gold">${p.price}</td>
                <td className="p-6">{p.stock}</td>
                <td className="p-6">
                  <div className="flex space-x-4">
                    <button className="text-gray-500 hover:text-white"><Edit2 size={16} /></button>
                    <button className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-luxury-black/90 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-luxury-black border border-white/10 p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif mb-8 text-luxury-gold italic">Add Exclusive Heritage Piece</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 block">Name</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 block">Price ($)</label>
                  <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 block">Description</label>
                <textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 block">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold">
                    {["Men's Wears", "Women's Wears", "Native Wears", "Accessories"].map(c => <option key={c} value={c} className="bg-luxury-black">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 block">Stock</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2 block">Heritage Images</label>
                <input type="file" multiple onChange={e => setImages(e.target.files)} className="w-full text-xs" />
              </div>
              <div className="flex justify-end space-x-6 pt-6">
                 <button type="button" onClick={() => setShowModal(false)} className="text-xs uppercase font-bold tracking-widest hover:text-red-500">Cancel</button>
                 <button type="submit" className="luxury-button px-10">PUBLISH TO STORE</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function AdminBookings() {
   const [bookings, setBookings] = useState<any[]>([]);
   useEffect(() => {
     axios.get("/api/admin/bookings").then(res => setBookings(res.data));
   }, []);

   return (
     <div className="space-y-12">
       <h2 className="text-4xl font-serif">BESPOKE BOOKINGS</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {bookings.map(b => (
           <div key={b._id} className="bg-white/5 border border-white/5 p-8 flex flex-col justify-between">
             <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${b.status === "pending" ? "bg-luxury-gold/10 text-luxury-gold" : "bg-green-500/10 text-green-500"}`}>
                    {b.status}
                  </span>
                  <p className="text-[10px] text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <h3 className="text-xl font-serif">{b.name}</h3>
                <p className="text-xs text-luxury-gold font-bold italic uppercase">{b.outfitType}</p>
                <div className="text-xs text-gray-400 space-y-1 lowercase tracking-wider">
                  <p>{b.email}</p>
                  <p>{b.phone}</p>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-4 italic">"{b.description}"</p>
             </div>
             <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                <button className="flex-grow text-[10px] uppercase font-bold tracking-widest border border-white/10 py-3 hover:bg-luxury-gold hover:text-luxury-black transition-all">Quick View</button>
                <button className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-green-500 transition-colors">
                  <CheckCircle size={18} />
                </button>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
}

function AdminOrders() {
  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-serif">ORDER MANAGEMENT</h2>
      <div className="bg-white/5 border border-white/5 p-20 text-center">
        <Package size={64} className="text-luxury-gold mx-auto mb-8 opacity-20" />
        <p className="text-sm uppercase tracking-widest text-gray-500">Orders are automatically synced from Paystack verified transactions.</p>
      </div>
    </div>
  );
}

function WebsiteSettings() {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File }>({});

  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "socialLinks") {
        data.append(k, JSON.stringify(v));
      } else if (k !== "logo" && k !== "favicon" && k !== "heroImage") {
        data.append(k, String(v));
      }
    });

    Object.entries(files).forEach(([k, v]) => {
      if (v) data.append(k, v as File);
    });

    try {
      await axios.put("/api/settings", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      await refreshSettings();
      alert("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-luxury-gold text-xs uppercase tracking-widest font-bold block mb-2">Editor</span>
          <h2 className="text-4xl font-serif">WEBSITE SETTINGS</h2>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="luxury-button flex items-center space-x-3">
          <Save size={18} />
          <span>{loading ? "SAVING..." : "SAVE CHANGES"}</span>
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 bg-white/5 p-8 border border-white/5">
          <h3 className="text-xs uppercase tracking-widest font-bold text-luxury-gold mb-6 border-b border-white/10 pb-4">General Info</h3>
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Website Name</label>
            <input value={formData.siteName} onChange={e => setFormData({ ...formData, siteName: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Brand Title</label>
            <input value={formData.brandTitle} onChange={e => setFormData({ ...formData, brandTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Tagline</label>
            <input value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
          </div>
        </div>

        <div className="space-y-8 bg-white/5 p-8 border border-white/5">
          <h3 className="text-xs uppercase tracking-widest font-bold text-luxury-gold mb-6 border-b border-white/10 pb-4">Branding & Assets</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-2">Logo</label>
              {formData.logo && <img src={formData.logo} className="h-10 mb-4 object-contain" />}
              <input type="file" onChange={e => e.target.files && setFiles({ ...files, logo: e.target.files[0] })} className="text-[10px]" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-2">Favicon</label>
              <input type="file" onChange={e => e.target.files && setFiles({ ...files, favicon: e.target.files[0] })} className="text-[10px]" />
            </div>
          </div>
        </div>

        <div className="space-y-8 bg-white/5 p-8 border border-white/5 lg:col-span-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-luxury-gold mb-6 border-b border-white/10 pb-4">Hero Section Editor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Hero Title</label>
                <input value={formData.heroTitle} onChange={e => setFormData({ ...formData, heroTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Hero Subtitle</label>
                <textarea value={formData.heroSubtitle} onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" rows={3} />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-2">Hero Background Image</label>
              {formData.heroImage && <img src={formData.heroImage} className="w-full h-40 object-cover mb-4 opacity-50" />}
              <input type="file" onChange={e => e.target.files && setFiles({ ...files, heroImage: e.target.files[0] })} className="text-[10px]" />
            </div>
          </div>
        </div>

        <div className="space-y-8 bg-white/5 p-8 border border-white/5 lg:col-span-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-luxury-gold mb-6 border-b border-white/10 pb-4">Contact & Socials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">WhatsApp Number</label>
              <input value={formData.whatsappNumber} onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Contact Email</label>
              <input value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Instagram URL</label>
              <input value={formData.socialLinks?.instagram || ""} onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })} className="w-full bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:border-luxury-gold" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await axios.get("/api/admin/reviews", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setReviews(res.data);
  };

  const approveReview = async (id: string) => {
    try {
      await axios.put(`/api/admin/reviews/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchReviews();
    } catch (err) {
      alert("Failed to approve review");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`/api/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-serif">REVIEWS MODERATION</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map(r => (
          <div key={r._id} className="bg-white/5 border border-white/5 p-8 space-y-6 relative group">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-serif italic">{r.user?.name}</h4>
                <p className="text-[10px] text-luxury-gold uppercase tracking-widest font-bold">on {r.product?.name}</p>
              </div>
              <div className="flex space-x-1 text-luxury-gold">
                {[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-sm text-gray-400 italic">"{r.comment}"</p>
            {r.image && <img src={r.image} className="w-20 h-20 object-cover border border-white/10" />}
            
            <div className="flex justify-between items-center pt-6 border-t border-white/10">
              <span className={`text-[10px] uppercase font-bold tracking-widest ${r.isApproved ? "text-green-500" : "text-luxury-gold"}`}>
                {r.isApproved ? "APPROVED" : "PENDING APPROVAL"}
              </span>
              <div className="flex space-x-4">
                {!r.isApproved && (
                  <button onClick={() => approveReview(r._id)} className="text-[10px] uppercase font-bold tracking-widest text-green-500 hover:underline">Approve</button>
                )}
                <button onClick={() => deleteReview(r._id)} className="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500 uppercase tracking-widest text-xs">No reviews to moderate.</p>}
      </div>
    </div>
  );
}
