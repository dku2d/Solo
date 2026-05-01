// import { Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import api from "../api";
// import PageLayout from "../components/PageLayout";

// export default function TenantsPage() {
//   const [tenants, setTenants] = useState([]);

//   useEffect(() => {
//     const loadTenants = async () => {
//       try {
//         const response = await api.get("/tenants");
//         setTenants(response.data);
//       } catch (error) {
//         console.error("Failed to load tenants", error);
//       }
//     };

//     loadTenants();
//   }, []);

//   const addTenant = async () => {
//   const first_name = prompt("First name:");
//   const last_name = prompt("Last name:");
//   const email = prompt("Email:");
//   const phone = prompt("Phone:");

//   if (!first_name || !email) return;

//   try {
//     await api.post("/tenants", {
//       first_name,
//       last_name,
//       email,
//       phone,
//     });

//     window.location.reload();
//   } catch (err) {
//     alert("Failed to add tenant");
//   }
// };

//   return (
//     <PageLayout
//       title="Tenants"
//       action={
//         <button className="dark-action-button" onClick={addTenant}>
//           <Plus size={20} />
//           <span>Add Tenant</span>
//         </button>
//       }
//     >
//       <div className="table-shell">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Lease Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tenants.map((tenant, index) => (
//               <tr key={tenant.id}>
//                 <td>{tenant.name}</td>
//                 <td>{tenant.email}</td>
//                 <td>{tenant.phone}</td>
//                 <td>
//                   <span className={`status-pill ${index === 1 ? "pending" : ""}`}>
//                     {index === 1 ? "Pending" : "Active"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </PageLayout>
//   );
// }

import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import PageLayout from "../components/PageLayout";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadTenants = async () => {
    const response = await api.get("/tenants");
    setTenants(response.data);
  };

  useEffect(() => {
    loadTenants().catch((error) => console.error("Failed to load tenants", error));
  }, []);

  const filteredTenants = useMemo(() => {
    const term = search.toLowerCase();
    return tenants.filter((tenant) =>
      `${tenant.name} ${tenant.email} ${tenant.phone}`.toLowerCase().includes(term)
    );
  }, [tenants, search]);

  const openAddModal = () => {
    setEditingTenant(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (tenant) => {
    setEditingTenant(tenant);
    setForm({
      first_name: tenant.first_name || "",
      last_name: tenant.last_name || "",
      email: tenant.email || "",
      phone: tenant.phone || "",
    });
    setShowModal(true);
  };

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const saveTenant = async (event) => {
    event.preventDefault();

    if (editingTenant) {
      const response = await api.put(`/tenants/${editingTenant.id}`, form);
      setTenants((prev) =>
        prev.map((tenant) => (tenant.id === editingTenant.id ? response.data : tenant))
      );
    } else {
      const response = await api.post("/tenants", form);
      setTenants((prev) => [...prev, response.data]);
    }

    setShowModal(false);
  };

  const removeTenant = async (tenantId) => {
    const confirmed = window.confirm(
      "Delete this tenant? Only do this for mistakes or test data."
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tenants/${tenantId}`);
      setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));
    } catch (error) {
      alert("Failed to delete tenant. This tenant may be connected to leases or payments.");
    }
  };

  return (
    <PageLayout
      title="Tenants"
      action={
        <button className="dark-action-button" onClick={openAddModal}>
          <Plus size={20} />
          <span>Add Tenant</span>
        </button>
      }
    >
      <div className="toolbar">
        <div className="mini-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenants..."
          />
        </div>
      </div>

      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Lease Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>{tenant.name}</td>
                <td>{tenant.email}</td>
                <td>{tenant.phone}</td>
                <td>
                  <span className="status-pill">{tenant.lease_status || "Active"}</span>
                </td>
                <td>
                  <div className="action-row">
                    <button className="edit-button" onClick={() => openEditModal(tenant)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => removeTenant(tenant.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editingTenant ? "Edit Tenant" : "Add Tenant"} onClose={() => setShowModal(false)}>
          <form className="modal-form" onSubmit={saveTenant}>
            <input name="first_name" value={form.first_name} onChange={updateField} placeholder="First name" required />
            <input name="last_name" value={form.last_name} onChange={updateField} placeholder="Last name" required />
            <input name="email" type="email" value={form.email} onChange={updateField} placeholder="Email" required />
            <input name="phone" value={form.phone} onChange={updateField} placeholder="Phone" required />
            <button className="primary-button" type="submit">
              {editingTenant ? "Save Changes" : "Add Tenant"}
            </button>
          </form>
        </Modal>
      )}
    </PageLayout>
  );
}