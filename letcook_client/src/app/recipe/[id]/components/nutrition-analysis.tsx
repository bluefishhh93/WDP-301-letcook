import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pizza, Beef, Cookie, Activity, Target, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ActivityLevel {
  label: string;
  description: string;
  multiplier: number;
  examples: string;
  ageRestrictions?: {
    min?: number;
    max?: number;
  };
}

const ACTIVITY_LEVELS: Record<string, ActivityLevel> = {
  sedentary: {
    label: "Ít vận động",
    description: "Công việc văn phòng, ít đi lại",
    multiplier: 1.2,
    examples: "Hầu hết thời gian ngồi: làm việc văn phòng, lái xe"
  },
  lightlyActive: {
    label: "Hoạt động nhẹ",
    description: "Đi bộ nhẹ 1-3 lần/tuần",
    multiplier: 1.375,
    examples: "Đi bộ nhẹ, yoga, việc nhà nhẹ nhàng"
  },
  moderatelyActive: {
    label: "Hoạt động vừa",
    description: "Tập thể dục 3-5 lần/tuần",
    multiplier: 1.55,
    examples: "Chạy bộ, đạp xe, bơi lội định kỳ"
  },
  veryActive: {
    label: "Hoạt động mạnh",
    description: "Tập luyện cường độ cao 6-7 lần/tuần",
    multiplier: 1.725,
    examples: "Tập gym chuyên sâu, vận động viên nghiệp dư",
    ageRestrictions: {
      min: 16,
      max: 60
    }
  },
  // extraActive: {
  //   label: "Vận động viên",
  //   description: "Tập luyện cường độ cao 2 lần/ngày",
  //   multiplier: 1.9,
  //   examples: "Vận động viên chuyên nghiệp, người lao động nặng",
  //   ageRestrictions: {
  //     min: 18,
  //     max: 45
  //   }
  // }
};

interface NutritionGoal {
  label: string;
  proteinMultiplier: number;
  fatMultiplier: number;
  carbMultiplier: number;
  calorieDeficit: number;
  description: string;
  restrictions?: {
    gender?: string[];
    minAge?: number;
    maxAge?: number;
    minBMI?: number;
    maxBMI?: number;
  };
}

const NUTRITION_GOALS: Record<string, NutritionGoal> = {
  weightLoss: {
    label: "Giảm cân",
    proteinMultiplier: 2.0,
    fatMultiplier: 0.8,
    carbMultiplier: 2.0,
    calorieDeficit: -500,
    description: "Giảm cân an toàn và duy trì cơ bắp",
    restrictions: {
      minBMI: 18.5 // Không cho phép giảm cân nếu BMI quá thấp
    }
  },
  maintenance: {
    label: "Duy trì cân nặng",
    proteinMultiplier: 1.6,
    fatMultiplier: 1.0,
    carbMultiplier: 3.0,
    calorieDeficit: 0,
    description: "Duy trì cân nặng và sức khỏe hiện tại"
  },
  muscleGain: {
    label: "Tăng cơ",
    proteinMultiplier: 2.2,
    fatMultiplier: 1.2,
    carbMultiplier: 4.0,
    calorieDeficit: 300,
    description: "Tăng khối lượng cơ bắp",
    restrictions: {
      minAge: 16,
      maxAge: 60
    }
  },
  // enduranceAthlete: {
  //   label: "Vận động viên sức bền",
  //   proteinMultiplier: 1.8,
  //   fatMultiplier: 1.1,
  //   carbMultiplier: 5.0,
  //   calorieDeficit: 0,
  //   description: "Cho người tập luyện sức bền",
  //   restrictions: {
  //     minAge: 16,
  //     maxAge: 55
  //   }
  // },
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 24.9) return "Bình thường";
  if (bmi < 29.9) return "Thừa cân";
  return "Béo phì";
};

const calculateNutritionNeeds = (
  weight: number, 
  height: number, 
  age: number, 
  gender: string, 
  activityLevel: string, 
  goal: string
): { 
  calories: number; 
  protein: number; 
  fat: number; 
  carbs: number;
  bmi: number;
  bmiCategory: string;
  warnings: string[];
} => {
  const warnings: string[] = [];
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);

  // Kiểm tra các giới hạn và đưa ra cảnh báo
  if (ACTIVITY_LEVELS[activityLevel].ageRestrictions) {
    const { min, max } = ACTIVITY_LEVELS[activityLevel].ageRestrictions;
    if (min && age < min) warnings.push(`Mức độ hoạt động này không được khuyến nghị cho người dưới ${min} tuổi`);
    if (max && age > max) warnings.push(`Mức độ hoạt động này không được khuyến nghị cho người trên ${max} tuổi`);
  }

  if (NUTRITION_GOALS[goal].restrictions) {
    const restrictions = NUTRITION_GOALS[goal].restrictions;
    if (restrictions.gender && !restrictions.gender.includes(gender)) {
      warnings.push(`Mục tiêu này không phù hợp với giới tính của bạn`);
    }
    if (restrictions.minAge && age < restrictions.minAge) {
      warnings.push(`Mục tiêu này chỉ phù hợp với người từ ${restrictions.minAge} tuổi trở lên`);
    }
    if (restrictions.maxAge && age > restrictions.maxAge) {
      warnings.push(`Mục tiêu này chỉ phù hợp với người dưới ${restrictions.maxAge} tuổi`);
    }
    if (restrictions.minBMI && bmi < restrictions.minBMI) {
      warnings.push(`BMI của bạn quá thấp cho mục tiêu này`);
    }
  }

  // Tính BMR với điều chỉnh theo độ tuổi
  let bmr = gender === 'male' 
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;

  // Điều chỉnh BMR cho người cao tuổi
  if (age >= 60) {
    bmr *= 0.9; // Giảm 10% cho người cao tuổi
  }

  const tdee = bmr * ACTIVITY_LEVELS[activityLevel].multiplier;
  
  // Điều chỉnh calories theo mục tiêu và độ tuổi
  let targetCalories = tdee + NUTRITION_GOALS[goal].calorieDeficit;
  
  // Điều chỉnh macros dựa trên mục tiêu và các yếu tố khác
  let targetProtein = weight * NUTRITION_GOALS[goal].proteinMultiplier;
  let targetFat = weight * NUTRITION_GOALS[goal].fatMultiplier;
  let targetCarbs = weight * NUTRITION_GOALS[goal].carbMultiplier;

  // Điều chỉnh cho người cao tuổi
  if (age >= 60) {
    targetProtein *= 1.2; // Tăng protein cho người cao tuổi
    targetFat *= 0.9; // Giảm chất béo
    targetCarbs *= 0.9; // Giảm carbs
  }

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(targetProtein),
    fat: Math.round(targetFat),
    carbs: Math.round(targetCarbs),
    bmi,
    bmiCategory,
    warnings
  };
};

const NutritionDashboard = () => {
  const [userStats, setUserStats] = useState({
    weight: 70,
    height: 170,
    age: 30,
    gender: 'male'
  });
  const [activityLevel, setActivityLevel] = useState('moderatelyActive');
  const [nutritionGoal, setNutritionGoal] = useState('maintenance');
  const [showWarnings, setShowWarnings] = useState(true);

  const targets = calculateNutritionNeeds(
    userStats.weight,
    userStats.height,
    userStats.age,
    userStats.gender,
    activityLevel,
    nutritionGoal
  );

  const [consumed, setConsumed] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });

  // Lọc các mục tiêu phù hợp với người dùng
  const getAvailableGoals = () => {
    return Object.entries(NUTRITION_GOALS).filter(([key, goal]) => {
      if (!goal.restrictions) return true;
      const { gender, minAge, maxAge, minBMI } = goal.restrictions;
      if (gender && !gender.includes(userStats.gender)) return false;
      if (minAge && userStats.age < minAge) return false;
      if (maxAge && userStats.age > maxAge) return false;
      if (minBMI && targets.bmi < minBMI) return false;
      return true;
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
            <User className="w-6 h-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Cân nặng (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={userStats.weight}
                onChange={(e) => setUserStats(prev => ({...prev, weight: Number(e.target.value)}))}
              />
            </div>
            <div>
              <Label htmlFor="height">Chiều cao (cm)</Label>
              <Input
                id="height"
                type="number"
                value={userStats.height}
                onChange={(e) => setUserStats(prev => ({...prev, height: Number(e.target.value)}))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Tuổi</Label>
              <Input
                id="age"
                type="number"
                value={userStats.age}
                onChange={(e) => setUserStats(prev => ({...prev, age: Number(e.target.value)}))}
              />
            </div>
            <div>
              <Label>Giới tính</Label>
              <RadioGroup
                value={userStats.gender}
                onValueChange={(value) => setUserStats(prev => ({...prev, gender: value}))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Nữ</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Alert>
            <AlertDescription className="space-y-2">
              <div>
                <span className="font-medium">BMI: </span>
                {targets.bmi.toFixed(1)} ({targets.bmiCategory})
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mụctiêu & Hoạt động</h2>
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activity Level Selector with Age-appropriate Recommendations */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Mức độ hoạt động
            </Label>
            <Select 
              value={activityLevel} 
              onValueChange={(value) => {
                setActivityLevel(value);
                // Reset warnings when changing activity level
                setShowWarnings(true);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ACTIVITY_LEVELS).map(([key, value]) => {
                  const isRestricted = value.ageRestrictions && 
                    ((value.ageRestrictions.min && userStats.age < value.ageRestrictions.min) ||
                     (value.ageRestrictions.max && userStats.age > value.ageRestrictions.max));
                  
                  return (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className={isRestricted ? "opacity-50" : ""}
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          {value.label}
                          {isRestricted && " (Không khuyến nghị)"}
                        </div>
                        <div className="text-xs text-gray-500">{value.examples}</div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500">
              {ACTIVITY_LEVELS[activityLevel].description}
            </div>
          </div>

          {/* Nutrition Goal Selector with Age/Gender Appropriate Goals */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Mục tiêu dinh dưỡng
            </Label>
            <Select 
              value={nutritionGoal} 
              onValueChange={(value) => {
                setNutritionGoal(value);
                setShowWarnings(true);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableGoals().map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="space-y-1">
                      <div className="font-medium">{value.label}</div>
                      <div className="text-xs text-gray-500">{value.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warnings and Recommendations */}
          {showWarnings && targets.warnings.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Lưu ý quan trọng:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {targets.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Age-specific Recommendations */}
          {userStats.age >= 60 && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Khuyến nghị cho người cao tuổi:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Tăng cường protein để duy trì khối lượng cơ</li>
                    <li>Giảm nhẹ lượng chất béo và carbohydrate</li>
                    <li>Chia nhỏ bữa ăn trong ngày</li>
                    <li>Tăng cường thực phẩm giàu canxi và vitamin D</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Daily Targets with Visual Indicators */}
          <div className="space-y-4">
            <h3 className="font-medium">Mục tiêu hàng ngày</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Calories</div>
                    <div className="text-2xl font-bold">{targets.calories}</div>
                    <div className="text-xs text-gray-500">kcal/ngày</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Beef className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-sm font-medium">Protein</div>
                    <div className="text-2xl font-bold">{targets.protein}</div>
                    <div className="text-xs text-gray-500">g/ngày</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Pizza className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-sm font-medium">Chất béo</div>
                    <div className="text-2xl font-bold">{targets.fat}</div>
                    <div className="text-xs text-gray-500">g/ngày</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Cookie className="w-5 h-5 text-brown-500" />
                  <div>
                    <div className="text-sm font-medium">Carbs</div>
                    <div className="text-2xl font-bold">{targets.carbs}</div>
                    <div className="text-xs text-gray-500">g/ngày</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="space-y-3">
            <h3 className="font-medium">Tiến độ hôm nay</h3>
            <div className="space-y-4">
              {[
                { label: 'Calories', icon: <PieChart className="w-4 h-4" />, current: consumed.calories, target: targets.calories, unit: 'kcal', color: 'bg-primary' },
                { label: 'Protein', icon: <Beef className="w-4 h-4" />, current: consumed.protein, target: targets.protein, unit: 'g', color: 'bg-red-500' },
                { label: 'Fat ', icon: <Pizza className="w-4 h-4" />, current: consumed.fat, target: targets.fat, unit: 'g', color: 'bg-yellow-500' },
                { label: 'Carbs', icon: <Cookie className="w-4 h-4" />, current: consumed.carbs, target: targets.carbs, unit: 'g', color: 'bg-brown-500' }
              ].map(({ label, icon, current, target, unit, color }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <span>
                      {current}/{target} {unit}
                    </span>
                  </div>
                  <Progress 
                    value={(current / target) * 100} 
                    className={color}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionDashboard;