import { Card } from "@/components/ui/card";
import { Beef, Cookie, Pi, PieChart, Pizza } from "lucide-react";

export default function NutritionTable({
  calories,
  protein,
  fat,
  carbs,
}: {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Nutritions</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Calories</div>
              <div className="text-2xl font-bold">{calories} <span className="text-xs text-gray-500">kcal</span></div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Beef className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm font-medium">Protein</div>
              <div className="text-2xl font-bold">{protein} <span className="text-xs text-gray-500">g</span></div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Pizza className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium">Fat</div>
              <div className="text-2xl font-bold">{fat} <span className="text-xs text-gray-500">g</span></div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Cookie className="w-5 h-5 text-brown-500" />
            <div>
              <div className="text-sm font-medium">Carbs</div>
              <div className="text-2xl font-bold">{carbs} <span className="text-xs text-gray-500">g</span></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
