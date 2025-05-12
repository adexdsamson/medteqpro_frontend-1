import React from "react";
import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick, disabled }) => (
  <div className="flex justify-center mt-4">
    <Button onClick={onClick} disabled={disabled} variant="outline" className="px-6 py-2 rounded-full">
      Load more
      <span className="ml-2 text-primary">• •</span>
    </Button>
  </div>
);

export default LoadMoreButton;