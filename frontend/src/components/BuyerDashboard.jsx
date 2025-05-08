// BuyerDashboard.jsx (frontend)
import AssignWorkerForm from './AssignWorkerForm';

export default function BuyerDashboard() {
  // Example of a fabricId the buyer is working with
  const fabricId = "some_fabric_id";

  return (
    <div>
      <h2>Buyer Dashboard</h2>
      <AssignWorkerForm fabricId={fabricId} />
    </div>
  );
}
