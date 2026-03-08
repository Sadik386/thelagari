import { TechSpecs as TechSpecsType } from "@/data/products";

interface TechSpecsTableProps {
  specs: TechSpecsType;
  className?: string;
}

const specLabels: Record<keyof TechSpecsType, string> = {
  lumens: "Light Output",
  runtime: "Runtime",
  weight: "Weight",
  chargingTime: "Charging Time",
  waterproof: "IP Rating",
  beamDistance: "Beam Distance",
  battery: "Battery",
};

const specUnits: Record<string, string> = {
  lumens: "lm",
};

const TechSpecsTable = ({ specs, className = "" }: TechSpecsTableProps) => {
  const entries = Object.entries(specs).filter(([, v]) => v !== undefined);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <tbody>
          {entries.map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
              <td className="font-mono text-xs tracking-wider text-muted-foreground py-3 px-4 whitespace-nowrap">
                {specLabels[key as keyof TechSpecsType] || key}
              </td>
              <td className="font-mono text-sm font-semibold text-foreground py-3 px-4 text-right">
                {typeof value === "number" ? (
                  <>
                    <span className="text-primary">{value.toLocaleString()}</span>
                    {specUnits[key] && <span className="text-muted-foreground ml-1 text-xs">{specUnits[key]}</span>}
                  </>
                ) : (
                  value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TechSpecsTable;
