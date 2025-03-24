import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function formatNumber(value) {
  return value.toLocaleString("en-US");
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [downPaymentPercentInput, setDownPaymentPercentInput] = useState(20);
  const [usePercentDownPayment, setUsePercentDownPayment] = useState(true);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [includeTaxes, setIncludeTaxes] = useState(true);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(Math.round((homePrice * 0.01) / 12));
  const [monthlyInsurance, setMonthlyInsurance] = useState(Math.round((homePrice * 0.0035) / 12));
  const [monthlyHOA, setMonthlyHOA] = useState(0);
  const [taxEdited, setTaxEdited] = useState(false);
  const [insuranceEdited, setInsuranceEdited] = useState(false);

  useEffect(() => {
    if (!taxEdited) {
      setMonthlyPropertyTax(Math.round((homePrice * 0.01) / 12));
    }
    if (!insuranceEdited) {
      setMonthlyInsurance(Math.round((homePrice * 0.0035) / 12));
    }
  }, [homePrice, taxEdited, insuranceEdited]);

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const baseMonthlyPayment =
    (loanAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  const totalMonthlyPayment =
    baseMonthlyPayment +
    (includeTaxes ? monthlyPropertyTax + monthlyInsurance : 0) +
    monthlyHOA;

  const downPaymentPercent = Math.round((downPayment / homePrice) * 100);

  const handlePercentChange = (e) => {
    const raw = e.target.value;
    const percent = raw === "" ? 0 : parseInt(raw.replace(/^0+(?=\d)/, ""));
    setDownPaymentPercentInput(raw);
    setDownPayment(Math.round((percent / 100) * homePrice));
  };

  const handleNumberInput = (setter, onEdit = null) => (e) => {
    const raw = e.target.value;
    const value = raw === "" ? 0 : parseInt(raw.replace(/^0+(?=\d)/, ""));
    setter(value);
    if (onEdit) onEdit(true);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                This is your total estimated monthly mortgage payment including applicable items below.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Home Price ($)</label>
              <input
                type="text"
                value={formatNumber(homePrice)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  const numericValue = parseInt(raw || "0");
                  setHomePrice(numericValue);
                  if (usePercentDownPayment) {
                    const percent = parseFloat(downPaymentPercentInput) || 0;
                    setDownPayment(Math.round((percent / 100) * numericValue));
                  }
                }}
                className="w-full border rounded px-3 py-2"
              />
              <Slider
                min={50000}
                max={2000000}
                step={1000}
                value={[homePrice]}
                onValueChange={([val]) => {
                  setHomePrice(val);
                  if (usePercentDownPayment) {
                    const percent = parseFloat(downPaymentPercentInput) || 0;
                    setDownPayment(Math.round((percent / 100) * val));
                  }
                }}
              />
            </div>

            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">
                Down Payment ({usePercentDownPayment ? `${downPaymentPercent}%` : `$${formatNumber(downPayment)}`})
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">%</span>
                <Switch
                  checked={!usePercentDownPayment}
                  onCheckedChange={() => setUsePercentDownPayment(!usePercentDownPayment)}
                />
                <span className="text-sm">$</span>
              </div>
            </div>
            {usePercentDownPayment ? (
              <div className="relative">
                <input
                  type="number"
                  value={downPaymentPercentInput}
                  onChange={handlePercentChange}
                  className="w-full border rounded px-3 py-2 pr-28"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-500">
                  ${formatNumber(downPayment)}
                </span>
              </div>
            ) : (
              <input
                type="text"
                value={formatNumber(downPayment)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  handleNumberInput(setDownPayment)({ target: { value: raw } });
                }}
                className="w-full border rounded px-3 py-2"
              />
            )}
            <Slider
              min={0}
              max={homePrice}
              step={1000}
              value={[downPayment]}
              onValueChange={([val]) => setDownPayment(val)}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Loan Term (years)</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => {
                  const raw = e.target.value.replace(/^0+(?=\d)/, "");
                  setLoanTerm(raw === "" ? 0 : parseInt(raw));
                }}
                className="w-full border rounded px-3 py-2"
              />
              <Slider
                min={5}
                max={40}
                step={1}
                value={[loanTerm]}
                onValueChange={([val]) => setLoanTerm(val)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                step={0.01}
                onChange={(e) => {
                  const raw = e.target.value.replace(/^0+(?=\d)/, "");
                  setInterestRate(raw === "" ? 0 : parseFloat(raw));
                }}
                className="w-full border rounded px-3 py-2"
              />
              <Slider
                min={0.5}
                max={15}
                step={0.1}
                value={[interestRate]}
                onValueChange={([val]) => setInterestRate(val)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="include-taxes">Include Taxes & Insurance</Label>
              <Switch
                id="include-taxes"
                checked={includeTaxes}
                onCheckedChange={(checked) => setIncludeTaxes(checked)}
              />
            </div>

            {includeTaxes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Monthly Property Tax ($)</label>
                  <input
                    type="text"
                    value={formatNumber(monthlyPropertyTax)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      handleNumberInput(setMonthlyPropertyTax, setTaxEdited)({ target: { value: raw } });
                    }}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Monthly Insurance ($)</label>
                  <input
                    type="text"
                    value={formatNumber(monthlyInsurance)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      handleNumberInput(setMonthlyInsurance, setInsuranceEdited)({ target: { value: raw } });
                    }}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            )}

            {includeTaxes && (
              <div>
                <label className="block text-sm font-medium mb-1">Monthly HOA ($)</label>
                <input
                  type="text"
                  value={formatNumber(monthlyHOA)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, "");
                    handleNumberInput(setMonthlyHOA)({ target: { value: raw } });
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            <div className="text-center">
              <h2 className="text-lg font-semibold">Estimated Monthly Payment</h2>
              <p className="text-2xl mt-2">${totalMonthlyPayment.toFixed(2)}</p>
              <div className="text-sm text-left mt-4 max-w-sm mx-auto">
                <h3 className="font-medium mb-1">Payment Breakdown</h3>
                <ul className="space-y-1">
                  <li>Principal & Interest: ${baseMonthlyPayment.toFixed(2)}</li>
                  {includeTaxes && (
                    <>
                      <li>Property Tax: ${monthlyPropertyTax.toFixed(2)}</li>
                      <li>Insurance: ${monthlyInsurance.toFixed(2)}</li>
                      <li>HOA: ${monthlyHOA.toFixed(2)}</li>
                    </>
                  )}
                </ul>
                <p className="text-sm text-gray-700 mt-2">
                  Your estimated monthly payment of ${totalMonthlyPayment.toFixed(2)} includes ${baseMonthlyPayment.toFixed(2)} for principal & interest
                  {includeTaxes ? `, ${monthlyPropertyTax.toFixed(2)} for property tax, ${monthlyInsurance.toFixed(2)} for insurance, and ${monthlyHOA.toFixed(2)} for HOA fees` : ""}.
                </p>
                {includeTaxes && (
                  <p className="text-sm text-gray-500 mt-2">(Includes taxes, insurance & HOA)</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


