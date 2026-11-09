// SANDBOX stub. Real version calls the reveal-contact edge function after auth + Turnstile.
export const RevealContact = (_: { operatorId: string; operatorName: string; redirectPath?: string }) => (
  <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
    Contact reveal is disabled in the sandbox.
  </div>
);
export default RevealContact;
