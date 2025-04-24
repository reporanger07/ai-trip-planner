import React from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="p-1 shadow-sm flex justify-between items-center">
      <img src="/logo.svg" />
      <div>
        <Button>Sign in</Button>
      </div>
    </div>
  );
};

export default Header;
