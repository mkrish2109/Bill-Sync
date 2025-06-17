import { useState, useEffect } from "react";
import { api } from "../helper/apiHelper";
import React from "react";
import { PageMeta } from "./common/PageMeta";

export default function BillForm() {
  const [type, setType] = useState("received");
  const [buyers, setBuyers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({
    buyerId: "",
    workerId: "",
    fabricDetails: [{ item: "", quantity: 0, unit: "meter" }],
    paymentDueInDays: 90,
    note: "",
  });

  useEffect(() => {
    api.get("/buyers").then((res) => setBuyers(res.data));
    api.get("/workers").then((res) => setWorkers(res.data));
  }, []);

  const submit = async () => {
    await api.post("/bills", { ...form, type });
    alert("Bill created!");
  };

  return (
    <>
      <PageMeta
        title="Create Bill | Bill Sync - Generate New Invoice"
        description="Create and generate new bills and invoices with our easy-to-use form. Add fabric details, set payment terms, and manage your billing process."
        keywords="create bill, generate invoice, new bill, invoice creation, billing form"
      />
      <div>
        <h2>Create Bill</h2>
        <select onChange={(e) => setType(e.target.value)}>
          <option value="received">Fabric Received</option>
          <option value="delivered">Work Delivered</option>
        </select>

        <select
          onChange={(e) => setForm((f) => ({ ...f, buyerId: e.target.value }))}
        >
          <option>Select Buyer</option>
          {buyers.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setForm((f) => ({ ...f, workerId: e.target.value }))}
        >
          <option>Select Worker</option>
          {workers.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>

        {form.fabricDetails.map((f, idx) => (
          <div key={idx}>
            <input
              placeholder="Item"
              onChange={(e) => {
                const fd = [...form.fabricDetails];
                fd[idx].item = e.target.value;
                setForm({ ...form, fabricDetails: fd });
              }}
            />
            <input
              type="number"
              placeholder="Quantity"
              onChange={(e) => {
                const fd = [...form.fabricDetails];
                fd[idx].quantity = e.target.value;
                setForm({ ...form, fabricDetails: fd });
              }}
            />
          </div>
        ))}

        {type === "delivered" && (
          <input
            type="number"
            placeholder="Payment Due in Days"
            onChange={(e) =>
              setForm({ ...form, paymentDueInDays: e.target.value })
            }
          />
        )}

        <button onClick={submit}>Submit</button>
      </div>
    </>
  );
}
