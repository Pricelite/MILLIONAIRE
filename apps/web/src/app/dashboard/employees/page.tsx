import { Surface } from "@/components/ui/surface";
import { ProgressRow } from "@/components/ui/progress-row";
import { StatusBadge } from "@/components/ui/status-badge";
import { employees } from "@/lib/mock-data";

export default function EmployeesPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <Surface className="overflow-hidden">
        <div className="grid grid-cols-5 gap-0 border-b border-white/10 bg-zinc-900/60 px-4 py-3 text-xs uppercase tracking-wider text-zinc-400">
          <span>Employe</span>
          <span>Role</span>
          <span>Planning</span>
          <span>Pointage</span>
          <span>Permissions</span>
        </div>
        {employees.map((employee) => (
          <div key={employee.id} className="grid grid-cols-5 gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-b-0">
            <span className="font-semibold text-zinc-100">{employee.name}</span>
            <span className="text-zinc-300">{employee.role}</span>
            <span className="text-zinc-300">{employee.shift}</span>
            <span className="text-zinc-300">{employee.checkin}</span>
            <StatusBadge label={employee.role === "Manager" ? "Admin" : "Standard"} tone={employee.role === "Manager" ? "info" : "neutral"} />
          </div>
        ))}
      </Surface>

      <Surface className="space-y-4 p-4 md:p-5">
        <h3 className="text-lg font-bold text-white">Performance equipe</h3>
        {employees.map((employee) => (
          <ProgressRow key={employee.id} label={employee.name} value={`${employee.performance}%`} percent={employee.performance} />
        ))}
      </Surface>
    </div>
  );
}
