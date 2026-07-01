import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function DonutChart({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>

      <div className="mt-5 grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
        <div className="relative mx-auto h-44 w-44">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={items}
                dataKey="value"
                innerRadius={54}
                outerRadius={76}
                paddingAngle={3}
                stroke="none"
              >
                {items.map((item) => (
                  <Cell fill={item.color} key={item.label} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 20px rgb(15 23 42 / 0.08)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-3xl font-bold text-slate-950">{total}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                assignments
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {items.map((item) => (
            <div className="flex items-center justify-between gap-3" key={item.label}>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-slate-950">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DonutChart;
