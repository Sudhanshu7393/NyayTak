import React, { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Plus, Users, Calendar, TrendingUp, ShieldCheck, Mail, ShieldAlert } from "lucide-react";
import { STATE_DISTRICTS } from "../districts.js";
import { REAL_LAWYERS } from "../lawyers.js";
import { authService } from "../firebase.js";

function AdminScreen({ onBack, lang }) {
  const [activeTab, setActiveTab] = useState("lawyers");
  const [customLawyers, setCustomLawyers] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  
  // New Lawyer Form State
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [lawyerName, setLawyerName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState("5.0 ⭐");
  const [cases, setCases] = useState("100+ cases");
  const [loc, setLoc] = useState("");

  useEffect(() => {
    // Load custom lawyers from localStorage
    try {
      const raw = localStorage.getItem("nyaytak_custom_lawyers");
      if (raw) setCustomLawyers(JSON.parse(raw));
    } catch (_) {}

    // Load booked appointments from localStorage
    try {
      const rawApts = localStorage.getItem("nyaytak_appointments");
      if (rawApts) setAppointments(JSON.parse(rawApts));
    } catch (_) {}

    // Load admin emails
    try {
      const rawAdmins = localStorage.getItem("nyaytak_admin_emails");
      let list = rawAdmins ? JSON.parse(rawAdmins) : [];
      if (!list.includes("sudhanshupandey7393@gmail.com")) {
        list.push("sudhanshupandey7393@gmail.com");
        localStorage.setItem("nyaytak_admin_emails", JSON.stringify(list));
      }
      setAdminEmails(list);
    } catch (_) {}

    // Load registered users list
    setUsersList(authService.getUsersList());
  }, []);

  const saveCustomLawyers = (updated) => {
    setCustomLawyers(updated);
    try {
      localStorage.setItem("nyaytak_custom_lawyers", JSON.stringify(updated));
    } catch (_) {}
  };

  const handleAddLawyer = (e) => {
    e.preventDefault();
    if (!selectedState || !selectedDistrict || !lawyerName.trim() || !phone.trim()) {
      alert("Please fill all required fields!");
      return;
    }

    const key = `${selectedState}|${selectedDistrict}`;
    const newLawyer = {
      id: `custom-${Date.now()}`,
      name: lawyerName,
      exp: specialization || "Property & Land Disputes Specialist",
      rating: rating,
      cases: cases,
      loc: loc || `${selectedDistrict} Court`,
      ph: phone
    };

    const updated = { ...customLawyers };
    if (!updated[key]) updated[key] = [];
    updated[key].push(newLawyer);

    saveCustomLawyers(updated);

    // Clear form
    setLawyerName("");
    setSpecialization("");
    setPhone("");
    setLoc("");
    alert("Advocate added successfully!");
  };

  const handleDeleteLawyer = (key, id) => {
    if (!window.confirm("Are you sure you want to delete this advocate?")) return;

    const updated = { ...customLawyers };
    if (updated[key]) {
      updated[key] = updated[key].filter((l) => l.id !== id);
      if (updated[key].length === 0) delete updated[key];
    }
    saveCustomLawyers(updated);
  };

  const handleDeleteAppointment = (idx) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    const updated = appointments.filter((_, i) => i !== idx);
    setAppointments(updated);
    try {
      localStorage.setItem("nyaytak_appointments", JSON.stringify(updated));
    } catch (_) {}
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminEmail.includes("@")) {
      alert("Please enter a valid email address!");
      return;
    }
    const email = newAdminEmail.trim().toLowerCase();
    if (adminEmails.includes(email)) {
      alert("This email is already an admin!");
      return;
    }
    const updated = [...adminEmails, email];
    setAdminEmails(updated);
    localStorage.setItem("nyaytak_admin_emails", JSON.stringify(updated));
    setNewAdminEmail("");
    alert(`${email} added as administrator.`);
  };

  const handleDeleteAdmin = (email) => {
    if (email === "sudhanshupandey7393@gmail.com") {
      alert("Root administrator cannot be removed!");
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${email} from administrators?`)) return;
    const updated = adminEmails.filter(e => e !== email);
    setAdminEmails(updated);
    localStorage.setItem("nyaytak_admin_emails", JSON.stringify(updated));
  };

  // Merge static real lawyers and custom ones for counting
  const allKeys = Array.from(new Set([...Object.keys(REAL_LAWYERS), ...Object.keys(customLawyers)]));
  let totalLawyers = 0;
  allKeys.forEach((k) => {
    totalLawyers += (REAL_LAWYERS[k] || []).length;
    totalLawyers += (customLawyers[k] || []).length;
  });

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      maxWidth: 800,
      margin: "0 auto",
      background: "var(--bg)",
      overflowY: "auto",
      padding: "20px 16px"
    }}>
      {/* Admin Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
        <button
          onClick={onBack}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text)"
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: "calc(18px * var(--fs))", fontWeight: 800, color: "#f0a500", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <ShieldCheck size={22} /> {lang === "hi" ? "नियंत्रण पटल (Admin Control)" : "Admin Dashboard"}
          </h2>
          <span style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-dim)" }}>
            Configure directory listings, view users database, and approve admins
          </span>
        </div>
      </div>

      {/* Stats Summary Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--surface)", padding: 14, borderRadius: 14, border: "1px solid var(--border)", textAlign: "center" }}>
          <Users size={20} style={{ color: "#f0a500", marginBottom: 4 }} />
          <div style={{ fontSize: "calc(18px * var(--fs))", fontWeight: 800 }}>{usersList.length}</div>
          <div style={{ fontSize: "calc(10.5px * var(--fs))", color: "var(--text-dim)" }}>Signed-up Users</div>
        </div>
        <div style={{ background: "var(--surface)", padding: 14, borderRadius: 14, border: "1px solid var(--border)", textAlign: "center" }}>
          <Calendar size={20} style={{ color: "#22c55e", marginBottom: 4 }} />
          <div style={{ fontSize: "calc(18px * var(--fs))", fontWeight: 800 }}>{appointments.length}</div>
          <div style={{ fontSize: "calc(10.5px * var(--fs))", color: "var(--text-dim)" }}>Total Bookings</div>
        </div>
        <div style={{ background: "var(--surface)", padding: 14, borderRadius: 14, border: "1px solid var(--border)", textAlign: "center" }}>
          <TrendingUp size={20} style={{ color: "#3b82f6", marginBottom: 4 }} />
          <div style={{ fontSize: "calc(18px * var(--fs))", fontWeight: 800 }}>{totalLawyers}</div>
          <div style={{ fontSize: "calc(10.5px * var(--fs))", color: "var(--text-dim)" }}>Active Directory</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, borderBottom: "1px solid var(--border)", marginBottom: 20, overflowX: "auto", whiteSpace: "nowrap" }}>
        <button
          onClick={() => setActiveTab("lawyers")}
          style={{
            padding: "10px 14px",
            border: "none",
            background: "transparent",
            color: activeTab === "lawyers" ? "#f0a500" : "var(--text-dim)",
            fontWeight: 700,
            fontSize: "calc(13px * var(--fs))",
            borderBottom: activeTab === "lawyers" ? "2px solid #f0a500" : "none",
            cursor: "pointer"
          }}
        >
          👥 Lawyers
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          style={{
            padding: "10px 14px",
            border: "none",
            background: "transparent",
            color: activeTab === "bookings" ? "#f0a500" : "var(--text-dim)",
            fontWeight: 700,
            fontSize: "calc(13px * var(--fs))",
            borderBottom: activeTab === "bookings" ? "2px solid #f0a500" : "none",
            cursor: "pointer"
          }}
        >
          📅 Bookings
        </button>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "10px 14px",
            border: "none",
            background: "transparent",
            color: activeTab === "users" ? "#f0a500" : "var(--text-dim)",
            fontWeight: 700,
            fontSize: "calc(13px * var(--fs))",
            borderBottom: activeTab === "users" ? "2px solid #f0a500" : "none",
            cursor: "pointer"
          }}
        >
          👤 Registered Users
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          style={{
            padding: "10px 14px",
            border: "none",
            background: "transparent",
            color: activeTab === "admins" ? "#f0a500" : "var(--text-dim)",
            fontWeight: 700,
            fontSize: "calc(13px * var(--fs))",
            borderBottom: activeTab === "admins" ? "2px solid #f0a500" : "none",
            cursor: "pointer"
          }}
        >
          🛡️ Admin Emails
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "lawyers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Add Lawyer Form */}
          <form onSubmit={handleAddLawyer} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "calc(14.5px * var(--fs))", fontWeight: 700, color: "var(--text)" }}>
              🆕 Add New Local Advocate
            </h3>
            
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>State *</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict("");
                  }}
                  required
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}
                >
                  <option value="">-- Select --</option>
                  {Object.keys(STATE_DISTRICTS).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>District *</label>
                <select
                  disabled={!selectedState}
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  required
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit", opacity: selectedState ? 1 : 0.6 }}
                >
                  <option value="">-- Select --</option>
                  {(STATE_DISTRICTS[selectedState] || []).map((dst) => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>Advocate Name *</label>
              <input
                type="text"
                placeholder="e.g. Adv. Santosh Pandey"
                value={lawyerName}
                onChange={(e) => setLawyerName(e.target.value)}
                required
                style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>Specialization / Exp</label>
              <input
                type="text"
                placeholder="e.g. Property Disputes & Civil Mutations"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>Phone / Contact *</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                  style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}
                />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>Office Location / Court</label>
                <input
                  type="text"
                  placeholder="e.g. Deoria Civil Court"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: "11px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#f0a500,#d4860a)",
                color: "#0a0e1a",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}
            >
              <Plus size={16} /> Add Lawyer to Directory
            </button>
          </form>

          {/* List of Custom Added Lawyers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
            <h3 style={{ fontSize: "calc(14.5px * var(--fs))", fontWeight: 700, color: "var(--text)", margin: "10px 0 4px 0" }}>
              📋 Custom Registered Advocates
            </h3>
            {Object.keys(customLawyers).length === 0 ? (
              <div style={{ padding: "30px 10px", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 12, textAlign: "center", color: "var(--text-dim)", fontSize: "calc(12.5px * var(--fs))" }}>
                No custom lawyers added yet. Use the form above to add lawyers.
              </div>
            ) : (
              Object.keys(customLawyers).map((key) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: "calc(11.5px * var(--fs))", fontWeight: 700, color: "#f0a500", textTransform: "uppercase", marginBottom: 6 }}>
                    📍 {key.replace("|", " > ")}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {customLawyers[key].map((lawyer) => (
                      <div key={lawyer.id} style={{
                        padding: "12px 14px",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div>
                          <b style={{ color: "var(--text)", fontSize: "calc(13.5px * var(--fs))" }}>{lawyer.name}</b>
                          <div style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)" }}>{lawyer.exp}</div>
                          <div style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-dim)", marginTop: 2 }}>
                            📞 {lawyer.ph} | 🏛️ {lawyer.loc}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteLawyer(key, lawyer.id)}
                          style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "none",
                            borderRadius: 8,
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#ef4444"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div style={{ textAlign: "left" }}>
          <h3 style={{ fontSize: "calc(14.5px * var(--fs))", fontWeight: 700, color: "var(--text)", margin: "0 0 12px 0" }}>
            🗓️ User Booked Consultations
          </h3>
          {appointments.length === 0 ? (
            <div style={{ padding: "40px 10px", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 12, textAlign: "center", color: "var(--text-dim)", fontSize: "calc(12.5px * var(--fs))" }}>
              No consultations booked yet on this browser.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {appointments.map((apt, idx) => (
                <div key={idx} style={{
                  padding: "14px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: "calc(11px * var(--fs))", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: 12 }}>
                        CONFIRMED
                      </span>
                      <span style={{ fontSize: "calc(11px * var(--fs))", fontFamily: "monospace", color: "var(--text-dim)" }}>
                        ID: {apt.bookingId || "N/A"}
                      </span>
                    </div>
                    <b style={{ color: "var(--text)", fontSize: "calc(14px * var(--fs))" }}>{apt.lawyerName}</b>
                    <div style={{ fontSize: "calc(12.5px * var(--fs))", color: "var(--text-mid)", marginTop: 2 }}>
                      📅 Date: <b>{apt.date}</b> | Time: <b>{apt.time}</b>
                    </div>
                    <div style={{ fontSize: "calc(12.5px * var(--fs))", color: "var(--text-mid)" }}>
                      📱 User Phone: <b>+91 {apt.phone}</b>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAppointment(idx)}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "none",
                      borderRadius: 8,
                      width: 34,
                      height: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#ef4444"
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div style={{ textAlign: "left" }}>
          <h3 style={{ fontSize: "calc(14.5px * var(--fs))", fontWeight: 700, color: "var(--text)", margin: "0 0 12px 0" }}>
            👤 Registered Users Database
          </h3>
          {usersList.length === 0 ? (
            <div style={{ padding: "40px 10px", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 12, textAlign: "center", color: "var(--text-dim)", fontSize: "calc(12.5px * var(--fs))" }}>
              No users registered yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {usersList.map((user) => (
                <div key={user.uid} style={{
                  padding: "12px 14px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <b style={{ color: "var(--text)", fontSize: "calc(13.5px * var(--fs))" }}>{user.displayName}</b>
                    <div style={{ fontSize: "calc(12px * var(--fs))", color: "var(--text-mid)" }}>📧 {user.email}</div>
                    <div style={{ fontSize: "calc(10.5px * var(--fs))", color: "var(--text-dim)", marginTop: 2 }}>
                      Registered on: {user.createdAt || "N/A"}
                    </div>
                  </div>
                  <span style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-dim)", fontFamily: "monospace" }}>
                    {user.uid}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "admins" && (
        <div style={{ textAlign: "left" }}>
          {/* Add Admin Email Form */}
          <form onSubmit={handleAddAdmin} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}>
            <h3 style={{ margin: 0, fontSize: "calc(14px * var(--fs))", fontWeight: 700, color: "var(--text)" }}>
              🛡️ Authorize New Administrator Email
            </h3>
            <p style={{ margin: 0, fontSize: "calc(11.5px * var(--fs))", color: "var(--text-dim)" }}>
              Only users logged in with these email addresses will be allowed to access the admin portal dashboard.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <input
                type="email"
                placeholder="e.g. advocate.friend@gmail.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontFamily: "inherit"
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#f0a500",
                  color: "#0a0e1a",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <Plus size={16} /> Authorize
              </button>
            </div>
          </form>

          <h3 style={{ fontSize: "calc(14.5px * var(--fs))", fontWeight: 700, color: "var(--text)", margin: "0 0 12px 0" }}>
            🔒 Approved Admin Emails
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {adminEmails.map((email) => (
              <div key={email} style={{
                padding: "12px 14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={16} style={{ color: "#f0a500" }} />
                  <span style={{ fontWeight: 600, fontSize: "calc(13.5px * var(--fs))", color: "var(--text)" }}>
                    {email}
                  </span>
                  {email === "sudhanshupandey7393@gmail.com" && (
                    <span style={{ fontSize: "calc(10px * var(--fs))", background: "rgba(240,165,0,0.15)", color: "#f0a500", padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>
                      ROOT OWNER
                    </span>
                  )}
                </div>
                {email !== "sudhanshupandey7393@gmail.com" && (
                  <button
                    onClick={() => handleDeleteAdmin(email)}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "none",
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#ef4444"
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminScreen;
