// import { Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import api from "../api";
// import PageLayout from "../components/PageLayout";

// export default function MaintenancePage() {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const loadMaintenance = async () => {
//       try {
//         const response = await api.get("/maintenance");
//         setRequests(response.data);
//       } catch (error) {
//         console.error("Failed to load maintenance", error);
//       }
//     };

//     loadMaintenance();
//   }, []);

//   const addRequest = async () => {
//   const description = prompt("Describe the issue:");

//   if (!description) return;

//   try {
//     await api.post("/maintenance", {
//       description,
//     });

//     window.location.reload();
//   } catch (err) {
//     alert("Failed to create request");
//   }
// };

//   return (
//     <PageLayout
//       title="Maintenance"
//       action={
//         <button className="dark-action-button" onClick={addRequest}>
//           <Plus size={20} />
//           <span>New Request</span>
//         </button>
//       }
//     >
//       <div className="table-shell">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>Property</th>
//               <th>Unit</th>
//               <th>Issue</th>
//               <th>Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.tenant_name || "Property"}</td>
//                 <td>{item.unit_number || "-"}</td>
//                 <td>{item.description}</td>
//                 <td>{item.created_at?.slice(0, 10)}</td>
//                 <td>
//                   <span
//                     className={`status-pill ${
//                       item.status.toLowerCase().includes("progress")
//                         ? "in-progress"
//                         : item.status.toLowerCase().includes("completed")
//                         ? "paid-dark"
//                         : "pending"
//                     }`}
//                   >
//                     {item.status}
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

export default function MaintenancePage() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");

  const loadMaintenance = async () => {
    const response = await api.get("/maintenance");
    setRequests(response.data);
  };

  useEffect(() => {
    loadMaintenance().catch((error) => console.error("Failed to load maintenance", error));
  }, []);

  const filteredRequests = useMemo(() => {
    const term = search.toLowerCase();
    return requests.filter((item) =>
      `${item.tenant_name} ${item.property_name} ${item.unit_number} ${item.description} ${item.status}`
        .toLowerCase()
        .includes(term)
    );
  }, [requests, search]);

  const createRequest = async (event) => {
    event.preventDefault();
    const response = await api.post("/maintenance", { description });
    setRequests((prev) => [response.data, ...prev]);
    setDescription("");
    setShowModal(false);
  };

  const completeRequest = async (requestId) => {
    const confirmed = window.confirm("Mark this maintenance request as completed?");
    if (!confirmed) return;

    const response = await api.put(`/maintenance/${requestId}/complete`);
    setRequests((prev) =>
      prev.map((item) => (item.id === requestId ? response.data : item))
    );
  };

  return (
    <PageLayout
      title="Maintenance"
      action={
        <button className="dark-action-button" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          <span>New Request</span>
        </button>
      }
    >
      <div className="toolbar">
        <div className="mini-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
          />
        </div>
      </div>

      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Unit</th>
              <th>Tenant</th>
              <th>Issue</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((item) => (
              <tr key={item.id}>
                <td>{item.property_name || "Property"}</td>
                <td>{item.unit_number || "-"}</td>
                <td>{item.tenant_name || "-"}</td>
                <td>{item.description}</td>
                <td>{item.created_at?.slice(0, 10)}</td>
                <td>
                  <span
                    className={`status-pill ${
                      item.status.toLowerCase().includes("completed")
                        ? "paid-dark"
                        : item.status.toLowerCase().includes("progress")
                        ? "in-progress"
                        : "pending"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status !== "Completed" ? (
                    <button className="complete-button" onClick={() => completeRequest(item.id)}>
                      Mark Complete
                    </button>
                  ) : (
                    <span className="muted-text">Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New Maintenance Request" onClose={() => setShowModal(false)}>
          <form className="modal-form" onSubmit={createRequest}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the maintenance issue..."
              required
            />
            <button className="primary-button" type="submit">
              Create Request
            </button>
          </form>
        </Modal>
      )}
    </PageLayout>
  );
}