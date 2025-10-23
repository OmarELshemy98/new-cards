// app/page.tsx  (Server Component)
import { redirect } from "next/navigation";
export default function Page() {
  redirect("/business-cards"); // أو /dashboard
}
