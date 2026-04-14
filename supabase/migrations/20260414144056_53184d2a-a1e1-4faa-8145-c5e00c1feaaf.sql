ALTER TABLE public.financial_entries
  ADD COLUMN installment_current INTEGER DEFAULT NULL,
  ADD COLUMN installment_total INTEGER DEFAULT NULL,
  ADD COLUMN installment_group_id UUID DEFAULT NULL;

CREATE INDEX idx_financial_entries_group ON public.financial_entries (installment_group_id) WHERE installment_group_id IS NOT NULL;