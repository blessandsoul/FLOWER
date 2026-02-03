interface OrderInfoGridProps {
  orderNumber: string;
  invoiceNumber: string;
  issueDate: string;
}

/**
 * 4-column grid displaying order information
 * Matches the order info bar in PDF invoices
 */
export function OrderInfoGrid({ orderNumber, invoiceNumber, issueDate }: OrderInfoGridProps) {
  const formattedDate = new Date(issueDate).toLocaleDateString('ka-GE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const items = [
    { label: 'შეკვეთა', value: orderNumber },
    { label: 'თარიღი', value: formattedDate },
    { label: 'ვალუტა', value: 'GEL (₾)' },
    { label: 'ინვოისი', value: invoiceNumber },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      {items.map((item, index) => (
        <div key={index}>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">
            {item.label}
          </span>
          <p className="text-gray-900 font-mono">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
