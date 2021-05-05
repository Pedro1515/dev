import React from "react";
import {
  Area,
  AreaChart as RAreaCharts,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaProps as RAreaProps,
} from "recharts";

type Data = {
  name: string;
  [key: string]: string | number;
};

export interface AreaChartProps {
  data: Data[];
  height: number;
  xAxisDataKey: keyof Data;
  AreaProps?: RAreaProps;
}

function CustomTooltip({
  xAxisDataKey,
  active,
  payload = [],
  label,
  ...props
}) {
  const [data] = payload;
  const { payload: { name = "", value = "", color = "" } = {} } = data ?? {};

  if (active) {
    return (
      <div className="flex px-3 py-2 bg-gray-800 text-xs rounded-md shadow-sm items-center opacity-90">
        <div className="text-gray-400 font-medium">{name}:</div>
        <div className="ml-2 font-semibold text-gray-100">{value}</div>
      </div>
    );
  }

  return null;
}

export function AreaChart({
  data,
  height,
  xAxisDataKey,
  AreaProps,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaCharts data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisDataKey}
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#a0aec0" }}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#a0aec0" }} />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Area type="monotone" {...AreaProps} />
      </RAreaCharts>
    </ResponsiveContainer>
  );
}
