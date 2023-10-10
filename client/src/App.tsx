// import { useState } from 'react'

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import "./App.css";
import React, { useState } from "react";

const queryClient = new QueryClient();

function App() {
  // const [count, setCount] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <Issues />
    </QueryClientProvider>
  );
}

type Issue = { id: number; title: string; description: string };

async function getIssues(): Promise<Array<Issue>> {
  const response = await fetch("http://localhost:8000");
  return response.json();
}

async function postIssue(data: Omit<Issue, "id">) {
  const response = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();

  if (!response.ok) throw responseBody;

  return responseBody;
}

async function updateIssue(data: Issue) {
  const response = await fetch(`http://localhost:8000/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
    }),
  });
  return response.json();
}

async function deleteIssue(id: number) {
  const response = await fetch(`http://localhost:8000/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

function Issues() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(0);
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({ queryKey: ["issues"], queryFn: getIssues });

  // Mutations
  const mutation = useMutation({
    mutationFn: postIssue,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  const editIssue = useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  const removeIssue = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  console.log(mutation.error);

  return (
    <div>
      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
      </label>

      <label>
        Description
        <input
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </label>

      <button
        onClick={() => {
          if (isEditing) {
            editIssue.mutate({ title, description, id: isEditing });
          } else {
            mutation.mutate({
              title,
              description,
            });
          }
          setTitle("");
          setDescription("");
          setIsEditing(0);
        }}
      >
        {isEditing ? "Update Issue" : "Add Issue"}
      </button>

      <ul>
        {query.data?.map((issue: Issue) => (
          <React.Fragment key={issue.id}>
            <li>
              Title: {issue.title} Description: {issue.description}
            </li>
            <button
              onClick={() => {
                setIsEditing(issue.id);
                setTitle(issue.title);
                setDescription(issue.description);
              }}
            >
              edit
            </button>
            <button
              onClick={() => {
                removeIssue.mutate(issue.id);
              }}
            >
              delete
            </button>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default App;
