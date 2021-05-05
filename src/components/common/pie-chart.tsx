import {
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Dot } from "./dot";
import classNames from "classnames";
import { percentage, sum } from "src/utils";

type Data = {
  name: string;
  value: number;
  color: string;
};

export interface PieChartProps {
  data: Data[];
  height: number;
}

export interface LegendWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export interface LegendProps {
  label: string;
  value: number | string;
  percentage: number;
  color: string;
}

export interface CustomTooltipProps extends TooltipProps {}

export function CustomTooltip({
  active,
  payload,
  label,
  ...props
}: CustomTooltipProps) {
  const [data] = payload;
  const { payload: { name = "", value = "", color = "" } = {} } = data ?? {};

  if (active) {
    return (
      <div className="flex px-3 py-2 bg-gray-800 text-xs rounded-md shadow-sm items-center opacity-90">
        <Dot {...{ color }} className="mr-2" />
        <div className="text-gray-400 font-medium">{name}:</div>
        <div className="ml-2 font-semibold text-gray-100">{value}</div>
      </div>
    );
  }

  return null;
}

export function LegendWrapper({ className, ...props }: LegendWrapperProps) {
  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "justify-end",
        "text-md",
        "text-xs",
        "divide-y",
        className
      )}
      {...props}
    />
  );
}

export function Legend({ label, value, percentage, color }: LegendProps) {
  return (
    <div
      className={classNames("flex", "items-center", "justify-between", "py-3")}
    >
      <div className="flex items-center w-1/3">
        <Dot className="mr-3" size="medium" {...{ color }} />
        <div className="truncate">{label}</div>
      </div>
      <div className="w-1/3 font-medium text-right">{value}</div>
      <div className="w-1/3 text-right text-gray-500">{percentage}%</div>
    </div>
  );
}

export function PieChart({ data, height }: PieChartProps) {
  return (
    <div className="flex flex-col flex-1 w-full">
      <div style={{ height }}>
        <ResponsiveContainer>
          <RPieChart>
            <Pie
              data={data}
              innerRadius={30}
              outerRadius={50}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  className={`text-${entry.color}-500`}
                  fill="currentColor"
                />
              ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
          </RPieChart>
        </ResponsiveContainer>
      </div>
      <LegendWrapper>
        {data.map(({ color, name, value }) => (
          <Legend
            key={name}
            label={name}
            {...{ color, value }}
            percentage={percentage(value, sum(data.map((x) => x.value)))}
          />
        ))}
      </LegendWrapper>
    </div>
  );
}
