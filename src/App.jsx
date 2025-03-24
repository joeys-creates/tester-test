import { useState, useEffect } from "react";
import "./App.css";

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
    <div className="app">
      <div className="container">
        <h1>Mortgage Calculator</h1>

        <label>Home Price ($)</label>
        <input
          type="range"
          min={50000}
          max={200000000}
          step={1000}
          value={homePrice}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setHomePrice(val);
            if (usePercentDownPayment) {
              const percent = parseFloat(downPaymentPercentInput) || 0;
              setDownPayment(Math.round((percent / 100) * val));
            }
          }}
        />
        <div>${formatNumber(homePrice)}</div>

        <label>
          Down Payment ({usePercentDownPayment ? `${downPaymentPercentInput}%` : `$${formatNumber(downPayment)}`})
        </label>
        <div className="toggle-row">
          <span>%</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={!usePercentDownPayment}
              onChange={() => setUsePercentDownPayment(!usePercentDownPayment)}
            />
            <span className="slider round"></span>
          </label>
          <span>$</span>
        </div>
        {usePercentDownPayment ? (
          <input
            type="number"
            value={downPaymentPercentInput}
            onChange={handlePercentChange}
          />
        ) : (
          <input
            type="number"
            value={downPayment}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              handleNumberInput(setDownPayment)({ target: { value: raw } });
            }}
          />
        )}

        <label>Loan Term (years)</label>
        <input
          type="range"
          min={5}
          max={40}
          step={1}
          value={loanTerm}
          onChange={(e) => setLoanTerm(parseInt(e.target.value))}
        />
        <div>{loanTerm} years</div>

        <label>Interest Rate (%)</label>
        <input
          type="range"
          min={0.5}
          max={15}
          step={0.1}
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
        />
        <div>{interestRate}%</div>

        <div className="toggle-row">
          <label>Include Taxes & Insurance</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={includeTaxes}
              onChange={(e) => setIncludeTaxes(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {includeTaxes && (
          <>
            <label>Estimated Monthly Property Tax ($)</label>
            <input
              type="number"
              value={monthlyPropertyTax}
              onChange={(e) =>
                handleNumberInput(setMonthlyPropertyTax, setTaxEdited)(e)
              }
            />

            <label>Estimated Monthly Insurance ($)</label>
            <input
              type="number"
              value={monthlyInsurance}
              onChange={(e) =>
                handleNumberInput(setMonthlyInsurance, setInsuranceEdited)(e)
              }
            />

            <label>Monthly HOA ($)</label>
            <input
              type="number"
              value={monthlyHOA}
              onChange={(e) =>
                handleNumberInput(setMonthlyHOA)(e)
              }
            />
          </>
        )}

        <h2>Estimated Monthly Payment</h2>
        <p className="total">${totalMonthlyPayment.toFixed(2)}</p>

        <div className="breakdown">
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
