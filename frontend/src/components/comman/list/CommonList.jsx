import React, { useEffect, useState } from "react";
import CommonListItem from "./CommonListItem";

function CommonList({
  fields,
  getAllItems,
  deleteItem,
  handleEdit,
  getImage,
  hideEdit,
  hideDelete,
  actions,
}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllItems().then((data) => {
      // Compute full name here
      const processed = data.map((user) => ({
        ...user,
        fullName: `${user.fname} ${user.lname}`, // 👈 computed field
      }));
      setItems(processed);
    });
  }, []);

  async function handleDelete(id) {
    const input = window.confirm("Are you sure you want to delete this?");
    if (input) {
      await deleteItem(id);
      alert("Deleted successfully.");
      const data = await getAllItems();
      const processed = data.data.map((user) => ({
        ...user,
        fullName: `${user.fname} ${user.lname}`,
      }));
      setItems(processed);
    }
  }

  return (
    <div>
      {items.map((value) => (
        <CommonListItem
          key={value._id}
          _id={value._id}
          title={value[fields.title]}
          desc={value[fields.desc]}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          getImage={getImage}
          value={value}
          hideEdit={hideEdit}
          hideDelete={hideDelete}
          actions={actions}
          setItems={setItems}
        />
      ))}
    </div>
  );
}

export default CommonList;
