import React from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Remove({
  items,
  pId,
  setRemoveItem,
  setAllItems,
  setPId,
  removeItem,
}) {
  const handleRemove = () => {
    const updatedItems = items.filter((_, index) => index !== pId);
    setAllItems(updatedItems);
    setPId("");
    setRemoveItem(false);
  };

  return (
    <div className={`flex items-center justify-center h-screen`}>
      <Card className={"w-76 p-6 shadow-lg bg-white"}>
        <X onClick={() => setRemoveItem(false)} className="cursor-pointer flex self-end" />
        <p>
          Are you sure you want to remove this item : {items[pId]?.productName}?
        </p>
        <Button onClick={handleRemove}>Confirm</Button>
      </Card>
    </div>
  );
}

export default Remove;