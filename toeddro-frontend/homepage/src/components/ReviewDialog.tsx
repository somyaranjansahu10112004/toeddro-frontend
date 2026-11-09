import { FormEvent, useState } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveLocalReview, type Review } from "@/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";

export type ReviewerType = "traveller" | "operator";
type Props = { open: boolean; onOpenChange: (v: boolean) => void; reviewerType: ReviewerType; operatorId?: string | null; operatorName?: string; onSaved?: () => void };

export const ReviewDialog = ({ open, onOpenChange, reviewerType, operatorId, operatorName, onSaved }: Props) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!operatorId) { setError("This listing does not have a usable identifier, so a review cannot be attached."); return; }
    if (!rating || rating < 1 || rating > 5) { setError("Choose a rating from 1 to 5 stars."); return; }
    if (!trimmedName) { setError("Enter a display name."); return; }
    if (trimmedBody.length < 10) { setError("Write at least 10 characters about your experience."); return; }
    if (trimmedBody.length > 1500) { setError("Keep your review under 1,500 characters."); return; }
    setSaving(true);
    const review: Review = { id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, operator_id: operatorId, reviewer_name: trimmedName.slice(0, 60), reviewer_location: null, business_name: operatorName || null, reviewer_type: reviewerType, rating, body: trimmedBody, is_published: true, created_at: new Date().toISOString(), storage: "local" };
    const saved = saveLocalReview(review);
    setSaving(false);
    if (!saved) { setError("Could not save this review in this browser. Check local storage settings and try again."); return; }
    onSaved?.();
    toast({ title: "Review saved on this device", description: "This prototype stores reviews only in this browser; they are not publicly shared." });
    setRating(0); setName(""); setBody(""); setError(""); onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>Review {operatorName ? operatorName : "this operator"}</DialogTitle><DialogDescription>Your feedback is saved locally in this browser for this prototype, not sent to a server.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <fieldset><legend className="text-sm font-bold mb-2">Your rating <span aria-hidden="true">*</span></legend><div className="flex gap-2" role="radiogroup" aria-label="Rating from 1 to 5 stars">{[1,2,3,4,5].map((n) => <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} ${n === 1 ? "star" : "stars"}`} onClick={() => { setRating(n); setError(""); }} className="rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" ><Star className={`w-8 h-8 ${n <= rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`} /></button>)}</div></fieldset>
        <label className="block text-sm font-bold">Display name *<input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="nickname" className="mt-1 block w-full rounded-xl border-2 border-foreground/20 bg-background px-3 py-2" required /></label>
        <label className="block text-sm font-bold">Your review *<textarea value={body} onChange={(e) => setBody(e.target.value)} minLength={10} maxLength={1500} rows={5} className="mt-1 block w-full resize-y rounded-xl border-2 border-foreground/20 bg-background px-3 py-2 font-normal" placeholder="What should other adventurers know?" required /><span className="text-xs text-muted-foreground">{body.length}/1500 characters</span></label>
        {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
        <button disabled={saving} type="submit" className="w-full rounded-full bg-foreground px-5 py-3 font-black uppercase text-sm text-background disabled:opacity-50">{saving ? "Saving…" : "Save local review"}</button>
      </form>
    </DialogContent>
  </Dialog>;
};
export default ReviewDialog;
