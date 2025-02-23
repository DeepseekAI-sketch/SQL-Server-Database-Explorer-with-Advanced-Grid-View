import React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Play } from "lucide-react";

interface QueryEditorProps {
  onExecute?: (query: string) => void;
  defaultQuery?: string;
  isExecuting?: boolean;
  disabled?: boolean;
}

const QueryEditor = ({
  onExecute = () => {},
  defaultQuery = "SELECT * FROM [ERP].[dbo].[BASE_ROLE]",
  isExecuting = false,
  disabled = false,
}: QueryEditorProps) => {
  const [query, setQuery] = React.useState(defaultQuery);

  const handleExecute = () => {
    if (query.trim() && onExecute) {
      onExecute(query);
    }
  };

  return (
    <Card className="w-full p-4 bg-background border shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">SQL Query Editor</h3>
          <Button
            onClick={handleExecute}
            disabled={disabled || isExecuting}
            className="w-24"
          >
            <Play className="w-4 h-4 mr-2" />
            {isExecuting ? "Running..." : "Execute"}
          </Button>
        </div>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="font-mono min-h-[120px] resize-y"
          disabled={disabled || isExecuting}
        />
      </div>
    </Card>
  );
};

export default QueryEditor;
