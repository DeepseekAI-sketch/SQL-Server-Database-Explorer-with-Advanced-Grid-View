import React, { useState } from "react";
import ConnectionPanel from "./ConnectionPanel";
import QueryEditor from "./QueryEditor";
import ResultsGrid from "./ResultsGrid";
import ErrorDisplay from "./ErrorDisplay";
import { connectDB, executeQuery } from "../lib/db";

interface HomeProps {
  initialConnected?: boolean;
}

const Home = ({ initialConnected = false }: HomeProps) => {
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<{
    message: string;
    severity: "error" | "warning" | "success";
  } | null>(null);

  const handleConnect = async (values: {
    serverName: string;
    database: string;
    username: string;
    password: string;
  }) => {
    console.log("Connection attempt with:", values);
    setIsConnecting(true);
    setError(null);
    try {
      await connectDB();
      setIsConnected(true);
      setError({
        message: `Successfully connected to ${values.database} on ${values.serverName}`,
        severity: "success",
      });
    } catch (err) {
      setError({
        message: "Failed to connect to database",
        severity: "error",
      });
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const [queryResults, setQueryResults] = useState<any[]>([]);

  const handleQueryExecute = async (query: string) => {
    console.log("Query execution attempt:", query);
    if (!isConnected) {
      setError({
        message: "Please connect to a database first",
        severity: "error",
      });
      return;
    }
    setIsExecuting(true);
    setError(null);
    try {
      const results = await executeQuery(query);
      setQueryResults(results);
      setError({
        message: "Query executed successfully",
        severity: "success",
      });
    } catch (err) {
      setError({
        message: "Failed to execute query",
        severity: "error",
      });
      setQueryResults([]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          SQL Database Explorer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-6">
          <div className="space-y-4">
            <ConnectionPanel
              onConnect={(values) => {
                console.log("Connection values:", values);
                handleConnect(values);
              }}
              isConnecting={isConnecting}
            />
          </div>

          <div className="space-y-4">
            {error && (
              <ErrorDisplay
                message={error.message}
                severity={error.severity}
                visible={true}
              />
            )}

            <QueryEditor
              onExecute={handleQueryExecute}
              isExecuting={isExecuting}
              disabled={!isConnected}
            />

            <ResultsGrid
              isLoading={isExecuting}
              data={queryResults}
              columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
