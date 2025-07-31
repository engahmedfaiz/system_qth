"use client"

import { cn } from "@/lib/utils"

import type * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
} from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Define the types for the chart components
type ChartComponent =
  | typeof LineChart
  | typeof BarChart
  | typeof PieChart
  | typeof RadialBarChart
  | typeof AreaChart
  | typeof ScatterChart

type ChartElementType = typeof Line | typeof Bar | typeof Pie | typeof RadialBar | typeof Area | typeof Scatter

interface ChartProps extends React.ComponentProps<typeof ChartContainer> {
  data: Record<string, any>[]
  chartConfig: ChartConfig
  chartType?: "line" | "bar" | "pie" | "radial" | "area" | "scatter"
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  chartElements?: {
    type: "line" | "bar" | "pie" | "radial" | "area" | "scatter"
    dataKey: string
    stroke?: string
    fill?: string
    name?: string
    [key: string]: any
  }[]
  categoryDataKey?: string
  valueDataKey?: string
  nameDataKey?: string
  aspectRatio?: number
  height?: number
  width?: number
  className?: string
}

const CHART_COMPONENTS: Record<string, ChartComponent> = {
  line: LineChart,
  bar: BarChart,
  pie: PieChart,
  radial: RadialBarChart,
  area: AreaChart,
  scatter: ScatterChart,
}

const CHART_ELEMENTS: Record<string, ChartElementType> = {
  line: Line,
  bar: Bar,
  pie: Pie,
  radial: RadialBar,
  area: Area,
  scatter: Scatter,
}

const Chart: React.FC<ChartProps> = ({
  data,
  chartConfig,
  chartType = "line",
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  chartElements,
  categoryDataKey,
  valueDataKey,
  nameDataKey,
  aspectRatio = 16 / 9,
  height = 300,
  width = 600,
  className,
  ...props
}) => {
  const ChartComponent = CHART_COMPONENTS[chartType]
  if (!ChartComponent) {
    console.error(`Unknown chart type: ${chartType}`)
    return null
  }

  const renderChartElements = () => {
    if (chartElements) {
      return chartElements.map((element, index) => {
        const ElementComponent = CHART_ELEMENTS[element.type]
        if (!ElementComponent) {
          console.warn(`Unknown chart element type: ${element.type}`)
          return null
        }
        return (
          <ElementComponent
            key={index}
            dataKey={element.dataKey}
            stroke={element.stroke || chartConfig[element.dataKey]?.stroke}
            fill={element.fill || chartConfig[element.dataKey]?.fill}
            name={element.name || chartConfig[element.dataKey]?.label}
            {...element}
          />
        )
      })
    }

    // Default rendering based on chartType if chartElements are not provided
    const defaultColor = "hsl(var(--chart-1))" // Default color from shadcn/ui chart config
    switch (chartType) {
      case "line":
        return (
          <Line
            dataKey={valueDataKey || Object.keys(chartConfig)[0]}
            stroke={chartConfig[Object.keys(chartConfig)[0]]?.stroke || defaultColor}
            fill={chartConfig[Object.keys(chartConfig)[0]]?.fill || defaultColor}
            name={chartConfig[Object.keys(chartConfig)[0]]?.label}
          />
        )
      case "bar":
        return (
          <Bar
            dataKey={valueDataKey || Object.keys(chartConfig)[0]}
            fill={chartConfig[Object.keys(chartConfig)[0]]?.fill || defaultColor}
            name={chartConfig[Object.keys(chartConfig)[0]]?.label}
          />
        )
      case "area":
        return (
          <Area
            dataKey={valueDataKey || Object.keys(chartConfig)[0]}
            stroke={chartConfig[Object.keys(chartConfig)[0]]?.stroke || defaultColor}
            fill={chartConfig[Object.keys(chartConfig)[0]]?.fill || defaultColor}
            name={chartConfig[Object.keys(chartConfig)[0]]?.label}
          />
        )
      case "pie":
        return (
          <Pie
            dataKey={valueDataKey || Object.keys(chartConfig)[0]}
            nameKey={nameDataKey || "name"}
            fill={defaultColor} // Pie charts often use different fills per segment
            {...chartElements?.[0]} // Allow overriding for pie
          />
        )
      case "radial":
        return (
          <RadialBar
            dataKey={valueDataKey || Object.keys(chartConfig)[0]}
            fill={defaultColor}
            name={chartConfig[Object.keys(chartConfig)[0]]?.label}
            {...chartElements?.[0]} // Allow overriding for radial
          />
        )
      case "scatter":
        return (
          <Scatter
            dataKey={valueDataKey || Object.keys(chartConfig)[0]}
            fill={defaultColor}
            name={chartConfig[Object.keys(chartConfig)[0]]?.label}
          />
        )
      default:
        return null
    }
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("min-h-[200px] w-full", className)}
      aspectRatio={aspectRatio}
      height={height}
      width={width}
      {...props}
    >
      <ChartComponent data={data}>
        {showGrid && <CartesianGrid vertical={false} />}
        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {renderChartElements()}
      </ChartComponent>
    </ChartContainer>
  )
}

interface ChartSelectProps extends React.ComponentProps<typeof Select> {
  label?: string
  options: { value: string; label: string }[]
}

const ChartSelect: React.FC<ChartSelectProps> = ({ label, options, ...props }) => {
  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      <Select {...props}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a value" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { Chart, ChartSelect }
