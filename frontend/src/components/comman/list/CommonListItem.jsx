import { Button } from "flowbite-react";
import React from "react";
import { HiPencil, HiTrash } from "react-icons/hi";

function CommonListItem({
  _id,
  image,
  getImage,
  title,
  desc,
  handleEdit,
  handleDelete,
  value,
  hideEdit,
  hideDelete,
  actions,
  setItems,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 py-2 border-b border-b-slate-300">
        <div className="w-16 h-16 shrink-0 rounded-full border border-slate-300 overflow-hidden">
          <img
            src={
              getImage ? getImage(value) : image || "/images/placeholder.jpg"
            }
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grow-[1]">
          <h3 className="font-bold">{title}</h3>
          {desc && <p>{desc}</p>}
        </div>

        

        <div className="flex gap-2">
          {!hideEdit && (
            <Button
              pill
              size="xs"
              onClick={() => {
                handleEdit(_id);
              }}>
              <HiPencil />
            </Button>
          )}
          {!hideDelete && (
            <Button
              pill
              size="xs"
              onClick={() => {
                handleDelete(_id);
              }}>
              <HiTrash />
            </Button>
          )}
          {actions &&
            actions.length &&
            actions.map((v) => {
              return v.renderAction ? (
                v.renderAction(_id, value, setItems)
              ) : (
                <Button
                  pill
                  size="xs"
                  className="!h-fit"
                  onClick={() => {
                    v.onClick(_id);
                  }}>
                  {v.icon}
                </Button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default CommonListItem;
