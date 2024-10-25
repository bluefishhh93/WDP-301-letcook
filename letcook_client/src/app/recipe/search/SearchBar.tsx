import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        enhanced: isEnhanced.toString()
      });
      window.location.href = `/recipe/search?${searchParams.toString()}`;
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="p-4 w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Switch
            id="enhanced-mode"
            checked={isEnhanced}
            onCheckedChange={setIsEnhanced}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="enhanced-mode" className="flex items-center gap-2 cursor-pointer">
            <Sparkles className={`w-4 h-4 ${isEnhanced ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className={`${isEnhanced ? 'text-blue-500' : 'text-gray-600'}`}>
              Enhanced AI Search
            </span>
          </Label>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEnhanced ? "AI-powered recipe search..." : "Search recipes..."}
            className="pl-10 pr-24 py-6 text-lg rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${
              isEnhanced 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-800 hover:bg-gray-900'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          {isEnhanced ? (
            <p className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Using AI to enhance your recipe search results
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Standard recipe search
            </p>
          )}
        </div>
      </form>
    </Card>
  )
}