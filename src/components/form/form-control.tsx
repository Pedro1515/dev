export interface FormControlProps {
  label: string;
  component: React.ReactNode;
}

export function FormControl({ label, component }: FormControlProps) {
  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex items-center">
        <div className="font-medium text-sm text-gray-800 w-1/4 lg:w-1/3">
          {label}
        </div>
        <div className="w-1/2 lg:w-1/3">{component}</div>
      </div>
    </div>
  );
}
