export interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FormSection({ title, subtitle, children }: FormSectionProps) {
  return (
    <div className="flex flex-col mb-6">
      <span className="font-medium text-lg">{title}</span>
      <span className="font-normal text-gray-600 leading-7 text-sm">
        {subtitle}
      </span>
      <div className="border-b border-gray-300 mt-5" />
      {children}
    </div>
  );
}
