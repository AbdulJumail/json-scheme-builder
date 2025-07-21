import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";


// Helper to create a new, empty field object
const createDefaultField = () => ({
  id: Date.now() + Math.random(), // Use a more unique key for React rendering
  keyName: "",
  type: "string",
  children: [],
});

// Recursively transforms the fields array into a final JSON object
function generateSchema(fields) {
  const schema = {};
  fields.forEach((field) => {
    if (!field.keyName) return; // Skip fields without a name
    switch (field.type) {
      case "string":
        schema[field.keyName] = "String (default)";
        break;
      case "number":
        schema[field.keyName] = 0;
        break;
      case "nested":
        schema[field.keyName] = generateSchema(field.children);
        break;
      default:
        break;
    }
  });
  return schema;
}

/**
 * FieldRow Component: Renders a single field and its children recursively.
 * This is the core building block of the schema builder.
 */
const FieldRow = ({ field, onUpdate, onRemove }) => {
  // Handles changes to the key name or type
  const handleUpdate = (change) => {
    onUpdate({ ...field, ...change });
  };

  // Adds a new nested child field
  const addChildField = () => {
    const newChildren = [...field.children, createDefaultField()];
    onUpdate({ ...field, children: newChildren });
  };

  // Updates a specific child field in the children array
  const handleChildUpdate = (updatedChild) => {
    const newChildren = field.children.map((child) =>
      child.id === updatedChild.id ? updatedChild : child
    );
    onUpdate({ ...field, children: newChildren });
  };

  // Removes a specific child field
  const handleChildRemove = (childId) => {
    const newChildren = field.children.filter((child) => child.id !== childId);
    onUpdate({ ...field, children: newChildren });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
        <Input
          placeholder="Field Name"
          value={field.keyName}
          onChange={(e) => handleUpdate({ keyName: e.target.value })}
          className="bg-neutral-900 border-neutral-600 placeholder:text-neutral-500"
        />
        <Select value={field.type} onValueChange={(type) => handleUpdate({ type })}>
          <SelectTrigger className="w-[180px] bg-neutral-900 border-neutral-600">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="nested">Nested Object</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-400" />
        </Button>
      </div>

      {field.type === "nested" && (
        <div className="ml-6 pl-4 border-l-2 border-dashed border-neutral-700 space-y-4">
          {field.children.map((child) => (
            <FieldRow
              key={child.id}
              field={child}
              onUpdate={handleChildUpdate}
              onRemove={() => handleChildRemove(child.id)}
            />
          ))}
          <Button variant="outline" size="sm" onClick={addChildField} className="border-neutral-700 hover:bg-neutral-800 hover:text-neutral-50 gap-2">
            <Plus className="h-4 w-4" /> Add Nested Field
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Main SchemaBuilder Component
 */
const SchemaBuilder = () => {
  const [fields, setFields] = useState([
    { id: 1, keyName: "user", type: "nested", children: [
        { id: 2, keyName: "name", type: "string", children: [] },
        { id: 3, keyName: "age", type: "number", children: [] },
        { id: 4, keyName: "address", type: "nested", children: [
            { id: 5, keyName: "street", type: "string", children: [] },
            { id: 6, keyName: "zip", type: "number", children: [] },
        ]},
    ]},
    { id: 7, keyName: "productId", type: "string", children: [] }
  ]);

  const addField = () => {
    setFields([...fields, createDefaultField()]);
  };

  const updateField = (updatedField) => {
    setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
  };

  const removeField = (fieldId) => {
    setFields(fields.filter(f => f.id !== fieldId));
  };

  const jsonOutput = generateSchema(fields);

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-50 p-4 sm:p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Schema Builder</h1>
          <p className="mt-2 text-lg text-neutral-400">Visually construct your JSON schema and see the output in real-time.</p>
        </header>
        
        {/* Main two-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Pane: Builder */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Builder</CardTitle>
              <Button onClick={addField} className="gap-2">
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length > 0 ? (
                fields.map((field) => (
                  <FieldRow
                    key={field.id}
                    field={field}
                    onUpdate={updateField}
                    onRemove={() => removeField(field.id)}
                  />
                ))
              ) : (
                <div className="text-center py-16 text-neutral-500 border-2 border-dashed border-neutral-700 rounded-lg">
                  <p>No fields defined.</p>
                  <p className="text-sm">Click "Add Field" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Pane: JSON Output */}
          <Card className="bg-neutral-900 border-neutral-800 lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle className="text-xl">JSON Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-black/40 text-sm font-mono overflow-x-auto h-[500px]">
                <code>{JSON.stringify(jsonOutput, null, 2)}</code>
              </pre>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default SchemaBuilder;
