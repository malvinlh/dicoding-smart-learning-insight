import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserIdForm from "../components/UserIdForm";
import { getInsightByUserId, mapRowToProfile } from "../api/insightsApi";

export default function Lookup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (userId) => {
    setError("");
    setLoading(true);
    try {
      const row = await getInsightByUserId(userId);
      const profile = mapRowToProfile(row);
      navigate(`/insight/${userId}`, { state: { profile } });
    } catch (e) {
      setError(e.message || "Failed to fetch insight.");
    } finally {
      setLoading(false);
    }
  };

  return <UserIdForm onSubmit={handleSubmit} loading={loading} error={error} />;
}
