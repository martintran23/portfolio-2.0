import { connection } from "next/server";
import { MailRoom } from "@/components/MailRoom";

export const instant = false;

export default async function MailPage() {
  await connection();

  return (
    <MailRoom
      accessKey={
        process.env.WEB3FORMS_ACCESS_KEY ??
        process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
        ""
      }
    />
  );
}
