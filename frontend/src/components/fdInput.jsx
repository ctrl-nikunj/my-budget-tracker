import React, { useState, useDeferredValue } from "react";
import { Input } from "@/components/ui/input";

const numberToWords = (num) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return formatter.format(num);
};

function FDInput() {
  const [fd, setFd] = useState({ principal: "" });
  const deferredPrincipal = useDeferredValue(fd.principal);

  return (
    <div className="space-y-2">
      <Input
        type="number"
        value={fd.principal}
        placeholder="Enter principal amount"
        required
        onChange={(e) => {
          setFd({
            ...fd,
            principal: e.target.value,
          });
        }}
      />
      {deferredPrincipal && !isNaN(deferredPrincipal) && (
        <p className="text-sm text-muted-foreground">
          {numberToWords(deferredPrincipal)}
        </p>
      )}
    </div>
  );
}

export default FDInput;
