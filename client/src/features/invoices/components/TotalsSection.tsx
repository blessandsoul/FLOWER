interface TotalsSectionProps {
  subtotalGel: string;
  vatAmount: string;
  discountGel: string;
  creditsUsedGel: string;
  totalGel: string;
}

/**
 * Invoice totals section with sky blue background box for grand total
 * Matches the totals design in PDF invoices
 */
export function TotalsSection({
  subtotalGel,
  vatAmount,
  discountGel,
  creditsUsedGel,
  totalGel,
}: TotalsSectionProps) {
  const hasDiscount = parseFloat(discountGel) > 0;
  const hasCredits = parseFloat(creditsUsedGel) > 0;

  return (
    <div className="flex justify-end">
      <div className="w-80 space-y-2.5 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>ქვეჯამი (დღგ-ს გარეშე):</span>
          <span className="text-gray-900">{parseFloat(subtotalGel).toFixed(2)} ₾</span>
        </div>

        {/* VAT */}
        <div className="flex justify-between text-gray-600">
          <span>დღგ (18%):</span>
          <span className="text-gray-900">{parseFloat(vatAmount).toFixed(2)} ₾</span>
        </div>

        {/* Discount (if any) */}
        {hasDiscount && (
          <div className="flex justify-between text-green-600">
            <span>ფასდაკლება:</span>
            <span>-{parseFloat(discountGel).toFixed(2)} ₾</span>
          </div>
        )}

        {/* Credits (if any) */}
        {hasCredits && (
          <div className="flex justify-between text-[#175eeb]">
            <span>კრედიტები:</span>
            <span>-{parseFloat(creditsUsedGel).toFixed(2)} ₾</span>
          </div>
        )}

        {/* Separator */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Grand Total - Sky Blue Box */}
        <div className="bg-blue-100 border-2 border-[#175eeb] rounded-lg p-3 flex justify-between items-center">
          <span className="font-bold text-[#175eeb] text-base">მთლიანი ჯამი:</span>
          <span className="font-bold text-[#175eeb] text-lg">
            {parseFloat(totalGel).toFixed(2)} ₾
          </span>
        </div>
      </div>
    </div>
  );
}
