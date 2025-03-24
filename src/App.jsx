import { useState, useEffect } from "react";

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
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: '2rem', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center' }}>Mortgage Calculator</h1>

        <label>Home Price ($)</label>
        <input type="number" value={homePrice} onChange={(e) => {
          const val = parseInt(e.target.value);
          setHomePrice(val);
          if (usePercentDownPayment) {
            const percent = parseFloat(downPaymentPercentInput) || 0;
            setDownPayment(Math.round((percent / 100) * val));
          }
        }} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />

        <label>Down Payment ({usePercentDownPayment ? `${downPaymentPercent}%` : `$${formatNumber(downPayment)}`})</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <label>%</label>
          <input type="checkbox" checked={!usePercentDownPayment} onChange={() => setUsePercentDownPayment(!usePercentDownPayment)} />
          <label>$</label>
        </div>
        {usePercentDownPayment ? (
          <input type="number" value={downPaymentPercentInput} onChange={handlePercentChange} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />
        ) : (
          <input type="number" value={downPayment} onChange={(e) => {
            const val = parseInt(e.target.value);
            setDownPayment(val);
          }} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />
        )}

        <label>Loan Term (years)</label>
        <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value))} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />

        <label>Interest Rate (%)</label>
        <input type="number" value={interestRate} step={0.01} onChange={(e) => setInterestRate(parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <label>Include Taxes & Insurance</label>
          <input type="checkbox" checked={includeTaxes} onChange={(e) => setIncludeTaxes(e.target.checked)} />
        </div>

        {includeTaxes && (
          <>
            <label>Estimated Monthly Property Tax ($)</label>
            <input type="number" value={monthlyPropertyTax} onChange={(e) => handleNumberInput(setMonthlyPropertyTax, setTaxEdited)(e)} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />

            <label>Estimated Monthly Insurance ($)</label>
            <input type="number" value={monthlyInsurance} onChange={(e) => handleNumberInput(setMonthlyInsurance, setInsuranceEdited)(e)} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />

            <label>Monthly HOA ($)</label>
            <input type="number" value={monthlyHOA} onChange={(e) => handleNumberInput(setMonthlyHOA)(e)} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />
          </>
        )}

        <h2 style={{ textAlign: 'center' }}>Estimated Monthly Payment</h2>
        <p style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>${totalMonthlyPayment.toFixed(2)}</p>

        <div style={{ marginTop: '2rem' }}>
          <h3>Payment Breakdown</h3>
          <ul>
            <li>Principal & Interest: ${baseMonthlyPayment.toFixed(2)}</li>
            {includeTaxes && (
              <>
                <li>Property Tax: ${monthlyPropertyTax.toFixed(2)}</li>
                <li>Insurance: ${monthlyInsurance.toFixed(2)}</li>
                <li>HOA: ${monthlyHOA.toFixed(2)}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
