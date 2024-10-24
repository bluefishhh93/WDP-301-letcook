import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts"

export interface TasteAnalysisData {
    subject: string;
    value: number;
    fullMark: number;
}

interface TasteAnalysisProps {
    data: TasteAnalysisData[];
}

export default function TasteAnalysis({ data }: TasteAnalysisProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Taste analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={data}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#333', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666', fontSize: 10 }} />
                    <Radar name="Taste" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend wrapperStyle={{ fontSize: 12, marginTop: '10px', color: '#333' }} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}