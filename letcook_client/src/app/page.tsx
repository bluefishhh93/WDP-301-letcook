"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChefHat, SearchIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import RecipeSection from "./recipe/components/RecipeSection";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        enhanced: isEnhanced.toString()
      });
      router.push(`/recipe/search?${searchParams.toString()}`);
    }
    
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl mb-6">
        <header className="text-center mb-12">
          <div className="mb-6">
            <Image  
              src="/letscook.png"
              alt="Recipe Finder Logo"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
            Search our database of thousands of recipes to find the perfect dish for any occasion.
          </p>
        </header>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Switch
              id="enhanced-mode"
              checked={isEnhanced}
              onCheckedChange={setIsEnhanced}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label 
              htmlFor="enhanced-mode" 
              className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300"
            >
              <Sparkles className={`w-4 h-4 ${isEnhanced ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className={`${isEnhanced ? 'text-blue-500' : ''}`}>
                Enhanced AI Search
              </span>
            </Label>
          </div>

          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <Input
              type="search"
              placeholder={isEnhanced ? "AI-powered recipe search..." : "Search for recipes..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20 py-6 text-md rounded-md shadow-lg focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 transition duration-200"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-md px-6 py-2 
                ${isEnhanced 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition duration-200`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                'Search'
              )}
            </Button>
          </form>

          {isEnhanced && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Using AI to enhance your recipe search results
            </p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Link href='/recipe/add' passHref>
            <Button className="flex items-center gap-2 px-6 py-3 rounded-md shadow-lg bg-slate-400 hover:bg-slate-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition duration-200">
              <ChefHat className="w-5 h-5" />
              Create New Recipe
            </Button>
          </Link>
        </div>
      </div>

      <RecipeSection />
    </main>
  );
}