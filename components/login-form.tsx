"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { t } = usePreferences();
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { document.title = `${t("brand")} | ${t(register ? "register" : "login")}`; }, [register, t]);
  return <div className={cn("flex flex-col gap-6", className)} {...props}>
    <Card>
      <CardHeader><CardTitle className="text-xl">{t("welcome")}</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-2" role="group" aria-label={t("signIn")}>
          <Button variant={!register ? "default" : "outline"} onClick={() => { setRegister(false); setError(""); }} aria-pressed={!register}>{t("login")}</Button>
          <Button variant={register ? "default" : "outline"} onClick={() => { setRegister(true); setError(""); }} aria-pressed={register}>{t("register")}</Button>
        </div>
        <form onSubmit={async (event) => {
          event.preventDefault(); setBusy(true); setError("");
          const data = new FormData(event.currentTarget);
          const credentials = { email: String(data.get("email")), password: String(data.get("password")) };
          try {
            const result = register
              ? await authClient.signUp.email({ ...credentials, name: String(data.get("name")) })
              : await authClient.signIn.email(credentials);
            if (result.error) { setError(t("authFailed")); return; }
            router.push("/?section=assets"); router.refresh();
          } catch { setError(t("authFailed")); }
          finally { setBusy(false); }
        }}>
          <FieldGroup>
            {register && <Field><FieldLabel htmlFor="name">{t("displayName")}</FieldLabel><Input id="name" name="name" autoComplete="name" required /></Field>}
            <Field><FieldLabel htmlFor="email">{t("email")}</FieldLabel><Input id="email" name="email" type="email" autoComplete="email" required /></Field>
            <Field><FieldLabel htmlFor="password">{t("password")}</FieldLabel><Input id="password" name="password" type="password" autoComplete={register ? "new-password" : "current-password"} minLength={register ? 8 : undefined} maxLength={128} required /></Field>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy}>{t(busy ? "working" : register ? "register" : "login")}</Button>
            <Button asChild variant="outline"><Link href="/">{t("backHome")}</Link></Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>;
}
