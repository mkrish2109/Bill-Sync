import { useState, useEffect } from "react";
import { api } from "../helper/apiHelper";

export default function Dashboard() {
  const [pendingBills, setPendingBills] = useState([]);
  const [overdueBills, setOverdueBills] = useState([]);

  useEffect(() => {
    // Fetch all pending and overdue bills from the backend
    api.get("/bills")
      .then((res) => {
        const bills = res.data;
        const pending = bills.filter((bill) => bill.paymentStatus === "pending");
        const overdue = bills.filter((bill) => bill.paymentStatus === "pending" && new Date(bill.paymentDueDate) < new Date());

        setPendingBills(pending);
        setOverdueBills(overdue);
      })
      .catch((err) => console.error("Failed to fetch bills", err));
  }, []);

  return (
    <div className="bg-gray-100 p-4 dark:bg-background-dark dark:text-text-dark">
      <h2>Dashboard</h2>
      <h3>Pending Payments</h3>
      <ul>
        {pendingBills.map((bill) => (
          <li key={bill._id}>{bill.buyerId?.name} owes {bill.workerId?.name} for fabrics.</li>
        ))}
      </ul>
      <h3>Overdue Payments</h3>
      <ul>
        {overdueBills.map((bill) => (
          <li key={bill._id}>
            <strong>{bill.buyerId?.name}</strong> owes <strong>{bill.workerId?.name}</strong> for fabrics.
            <br />
            Payment is overdue!
          </li>
        ))}
      </ul>
    </div>
  );
}
