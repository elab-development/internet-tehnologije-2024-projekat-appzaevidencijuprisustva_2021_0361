import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function BarChart({ title, data, emptyMessage = 'No data available.' }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>

      {data.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="mt-5 h-80">
          <ResponsiveContainer height="100%" width="100%">
            <RechartsBarChart data={data} margin={{ bottom: 18, left: -18, right: 12, top: 12 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                interval={0}
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickLine={false}
                angle={-15}
                textAnchor="end"
              />
              <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 20px rgb(15 23 42 / 0.08)',
                }}
                cursor={{ fill: '#eff6ff' }}
              />
              <Bar dataKey="value" fill="#2563eb" name="Lessons" radius={[6, 6, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default BarChart;
