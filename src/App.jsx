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
    const percent = parseInt(e.target.value);
    setDownPaymentPercentInput(percent);
    setDownPayment(Math.round((percent / 100) * homePrice));
  };

  const handleNumberInput = (setter, onEdit = null) => (e) => {
    const value = parseInt(e.target.value);
    setter(value);
    if (onEdit) onEdit(true);
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: '2rem', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center' }}>Mortgage Calculator</h1>

        <label>Home Price ($)</label>
        <input type="range" min={50000} max={2000000} step={10000} value={homePrice} onChange={(e) => {
          const val = parseInt(e.target.value);
          setHomePrice(val);
          if (usePercentDownPayment) {
            const percent = parseFloat(downPaymentPercentInput) || 0;
            setDownPayment(Math.round((percent / 100) * val));
          }
        }} style={{ width: '100%', marginBottom: '0.5rem' }} />
        <div style={{ marginBottom: '1rem' }}>${formatNumber(homePrice)}</div>

        <label>Down Payment ({usePercentDownPayment ? `${downPaymentPercentInput}%` : `$${formatNumber(downPayment)}`})</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <button onClick={() => setUsePercentDownPayment(true)} style={{ backgroundColor: usePercentDownPayment ? '#ccc' : '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>%</button>
          <button onClick={() => setUsePercentDownPayment(false)} style={{ backgroundColor: !usePercentDownPayment ? '#ccc' : '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>$</button>
        </div>
        {usePercentDownPayment ? (
          <input type="range" min={0} max={100} step={1} value={downPaymentPercentInput} onChange={handlePercentChange} style={{ width: '100%', marginBottom: '1rem' }} />
        ) : (
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(parseInt(e.target.value))} style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />
        )}

        <label>Loan Term (years): {loanTerm}</label>
        <input type="range" min={5} max={40} step={1} value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value))} style={{ width: '100%', marginBottom: '1rem' }} />

        <label>Interest Rate (%): {interestRate}</label>
        <input type="range" min={1} max={15} step={0.1} value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value))} style={{ width: '100%', marginBottom: '1rem' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <label>Include Taxes & Insurance</label>
          <label className="switch">
            <input type="checkbox" checked={includeTaxes} onChange={(e) => setIncludeTaxes(e.target.checked)} />
            <span className="slider round"></span>
          </label>
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
