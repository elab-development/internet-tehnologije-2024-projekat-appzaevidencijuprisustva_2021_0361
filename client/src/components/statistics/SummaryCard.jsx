function SummaryCard({ label, value, helper, tone = 'blue' }) {
  const toneClasses = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    green: 'border-green-100 bg-green-50 text-green-700',
    red: 'border-red-100 bg-red-50 text-red-700',
    yellow: 'border-yellow-100 bg-yellow-50 text-yellow-700',
  };

  return (
    <article className={['rounded-lg border p-5', toneClasses[tone]].join(' ')}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
      {helper && <p className="mt-2 text-sm text-slate-600">{helper}</p>}
    </article>
  );
}

export default SummaryCard;
