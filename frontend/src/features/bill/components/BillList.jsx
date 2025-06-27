import { useState, useEffect } from "react";
import React from "react";
import { api } from "../../../helper/apiHelper";
import { PageMeta } from "../../../components/common/PageMeta";

export default function BillList() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    // Fetch all bills from the backend
    api
      .get("/bills")
      .then((res) => setBills(res.data))
      .catch((err) => console.error("Failed to fetch bills", err));
  }, []);

  const markAsPaid = async (billId) => {
    try {
      const response = await api.patch(`/bills/${billId}/pay`);
      if (response.status === 200) {
        alert("Bill marked as paid!");
        setBills(
          bills.map((bill) =>
            bill._id === billId ? { ...bill, paymentStatus: "paid" } : bill
          )
        );
      }
    } catch (error) {
      console.error("Failed to update payment status", error);
    }
  };

  return (
    <>
      <PageMeta
        title="Bills | Bill Sync - Manage Your Invoices"
        description="View and manage all your bills and invoices in one place. Track payments, generate reports, and stay on top of your finances."
        keywords="bills management, invoice tracking, payment history, financial records, bill organization"
      />
      <div>
        <h2>Bill List</h2>
        <table>
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Worker</th>
              <th>Fabric Details</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill.buyerId?.name}</td>
                <td>{bill.workerId?.name}</td>
                <td>
                  {bill.fabricDetails.map((f, idx) => (
                    <div key={idx}>
                      {f.item} ({f.quantity} {f.unit})
                    </div>
                  ))}
                </td>
                <td>{bill.paymentStatus}</td>
                <td>
                  {bill.paymentStatus === "pending" && (
                    <button onClick={() => markAsPaid(bill._id)}>
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
