import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { BASE_URL } from "../../../services/api";

const BankAccountForm = () => {
  const { token } = useAuth();
  const [bankName,setBankName] = useState();
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/stripe/connect-bank-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ bankName, bankAccountNumber: bankAccountNumber.trim(), routingNumber: routingNumber.trim() }),

      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      setSuccess(true);
      setBankAccountNumber("");
      setRoutingNumber("");
      setBankName("");
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Connect Bank Account</h1>
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
    Bank Name
  </label>
  <input
    type="text"
    id="bankName"
    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    value={bankName}
    onChange={(e) => setBankName(e.target.value)}
    required
  />
</div>
        <div className="mb-4">
          <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">
            Bank Account Number
          </label>
          <input
            type="text"
            id="bankAccountNumber"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">
            Routing Number
          </label>
          <input
            type="text"
            id="routingNumber"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">Bank account connected successfully!</div>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md font-medium"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Bank Account"}
        </button>
      </form>
    </div>
  );
};

export default BankAccountForm;
