import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SearchModeSwitchProps {
  onToggle: (enhanced: boolean) => void;
}

export default function SearchModeSwitch({ onToggle }: SearchModeSwitchProps) {
  const [isEnhanced, setIsEnhanced] = useState(false);

  const handleToggle = () => {
    const newValue = !isEnhanced;
    setIsEnhanced(newValue);
    onToggle(newValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="enhanced-mode" checked={isEnhanced} onCheckedChange={handleToggle} />
      <Label htmlFor="enhanced-mode">Enhanced Search</Label>
    </div>
  );
}