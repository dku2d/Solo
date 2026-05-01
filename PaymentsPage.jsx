import { useEffect, useState } from "react";
import api from "../api";
import PageLayout from "../components/PageLayout";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await api.get("/payments");
        setPayments(response.data);
      } catch (error) {
        console.error("Failed to load payments", error);
      }
    };

    loadPayments();
  }, []);

  return (
    <PageLayout title="Payments">
      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>Lease #{payment.lease_id}</td>
                <td>${Number(payment.amount).toLocaleString()}</td>
                <td>{payment.payment_date}</td>
                <td>
                  <span
                    className={`status-pill ${
                      payment.status.toLowerCase() === "paid"
                        ? "paid-dark"
                        : payment.status.toLowerCase() === "late"
                        ? "late"
                        : "pending"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}