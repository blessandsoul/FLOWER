import type { InvoiceItem } from '@/types';

interface ItemsTableProps {
  items: InvoiceItem[];
}

/**
 * Professional line items table with FLORCA Blue header and alternating rows
 * Matches the table design in PDF invoices
 */
export function ItemsTable({ items }: ItemsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        {/* FLORCA Blue Header */}
        <thead>
          <tr className="bg-[#175eeb] text-white">
            <th className="py-3 px-4 text-left font-semibold">პროდუქტი</th>
            <th className="py-3 px-4 text-center font-semibold">რაოდ.</th>
            <th className="py-3 px-4 text-right font-semibold">ერთ. ფასი</th>
            <th className="py-3 px-4 text-right font-semibold">დღგ</th>
            <th className="py-3 px-4 text-right font-semibold">ჯამი</th>
          </tr>
        </thead>

        {/* Alternating Row Backgrounds */}
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              className={`border-b last:border-0 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-blue-50 print:hover:bg-transparent`}
            >
              <td className="py-3 px-4 text-gray-900">{item.productName}</td>
              <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
              <td className="py-3 px-4 text-right text-gray-900">
                {parseFloat(item.unitPriceGel).toFixed(2)} ₾
              </td>
              <td className="py-3 px-4 text-right text-gray-900">
                {parseFloat(item.vatAmount).toFixed(2)} ₾
              </td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                {parseFloat(item.totalGel).toFixed(2)} ₾
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
