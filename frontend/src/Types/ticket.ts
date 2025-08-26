export interface Ticket {
  id: number;
  type: string;
  title: string;
  description: string;
  status:
    | "Open"
    | "Assigned"
    | "Reopened"
    | "In Progress"
    | "Resolved"
    | "Closed"
    | "Not Resolved";
  priority: "Low" | "Medium" | "High";
  agentResponse: string | null;
}