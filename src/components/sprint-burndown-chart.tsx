'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Sprint } from '@/lib/data';

type SprintBurndownChartProps = {
  sprint: Sprint;
};

const chartConfig = {
  ideal: {
    label: 'Ideal Burndown',
    color: 'hsl(var(--muted-foreground))',
  },
  actual: {
    label: 'Actual Burndown',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function SprintBurndownChart({ sprint }: SprintBurndownChartProps) {
  // In a real app, this data would come from your backend.
  // Here we simulate it based on mock data for demonstration.
  const totalStoryPoints = sprint.stories.reduce((acc, story) => acc + story.storyPoints, 0);
  const sprintDurationDays = Math.max(1, (new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 3600 * 24));
  const todayIndex = 12; // Simulate that we are on day 12 of the sprint

  const chartData = Array.from({ length: sprintDurationDays + 1 }, (_, i) => {
    const day = `Day ${i}`;
    
    // The "AI-generated" ideal burndown line. A linear progression.
    const idealPoints = Math.max(0, totalStoryPoints - (totalStoryPoints / sprintDurationDays) * i);
    
    // Simulate actual burndown based on 'done' stories.
    // In a real app, you would track story completion day by day.
    let remainingPoints = totalStoryPoints;
    if (i >= 2) remainingPoints -= 5; // Story 1 done
    if (i >= 4) remainingPoints -= 3; // Story 2 done
    
    return {
      day,
      ideal: Math.round(idealPoints * 10) / 10,
      actual: i > todayIndex ? null : Math.max(0, remainingPoints),
    };
  });
  
  // Refine actual burndown simulation for a more realistic curve
  const simulatedActualData = [totalStoryPoints, totalStoryPoints, 53, 53, 50, 50, 42, 42, 42, 42, 40, 40, 35];
  for(let i=0; i < simulatedActualData.length && i < chartData.length; i++) {
    chartData[i].actual = simulatedActualData[i];
  }


  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{ value: 'Story Points', angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle' } }}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={70}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" labelClassName="font-semibold" />}
        />
        <Line
          dataKey="ideal"
          type="monotone"
          stroke="var(--color-ideal)"
          strokeWidth={2}
          dot={false}
          strokeDasharray="4 4"
        />
        <Line
          dataKey="actual"
          type="monotone"
          stroke="var(--color-actual)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-actual)",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
