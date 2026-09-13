-- HVAC Follow-Up Board — realistic demo data (Indian HVAC service niche).
-- Run this after schema.sql. It clears the table first, so re-running is safe.
-- Phone numbers are fictional.

truncate table public.follow_ups;

insert into public.follow_ups
  (customer_name, phone, job_type, job_value, stage, last_contact_at, follow_up_at, notes)
values
  ('Ramesh Sharma', '+91 90000 00001', 'Quote', 2800.00, 'New',
   now() - interval '2 days', now() + interval '1 day',
   'Split AC gas refill + stabiliser check, quote to send'),

  ('Green Leaf Apartments (Nair)', '+91 90000 00002', 'Quote', 6500.00, 'Contacted',
   now() - interval '4 days', now() - interval '1 day',
   '3 AC deep service, AMC renewal quote sent'),

  ('Patel Villa', '+91 90000 00003', 'Appointment', 42000.00, 'Awaiting confirmation',
   now() - interval '6 days', now() - interval '2 days',
   '1.5T split install, slot held for Saturday'),

  ('Kapoor Clinic', '+91 90000 00004', 'Quote', 18500.00, 'New',
   now() - interval '1 day', now() + interval '2 days',
   'Duct cleaning + AMC renewal, quote due today'),

  ('Mehta Apartments', '+91 90000 00005', 'Appointment', 1500.00, 'Contacted',
   now() - interval '3 days', now(),
   'Window AC not cooling, revisit needed'),

  ('Iyer Household', '+91 90000 00006', 'Quote', 7200.00, 'Awaiting confirmation',
   now() - interval '5 days', now() - interval '1 day',
   'Outdoor PCB replacement, waiting on approval'),

  ('Sunrise Hotel', '+91 90000 00007', 'Appointment', 96000.00, 'New',
   now() - interval '7 days', now() - interval '3 days',
   '12-room AC service contract, site visit done'),

  ('Bose Residence', '+91 90000 00008', 'Quote', 56000.00, 'Contacted',
   now() - interval '2 days', now() + interval '1 day',
   'Cassette AC install, second quote requested'),

  ('Verma Dental', '+91 90000 00009', 'Quote', 9800.00, 'Booked',
   now() - interval '1 day', now() + interval '3 days',
   'VRF indoor unit service booked for Tuesday'),

  ('Anchor Textiles', '+91 90000 00010', 'Appointment', 135000.00, 'Awaiting confirmation',
   now() - interval '8 days', now() - interval '4 days',
   'Factory chiller service, PO awaited'),

  ('Kuldeep Singh', '+91 90000 00011', 'Quote', 3400.00, 'Booked',
   now(), now() + interval '2 days',
   'AC repair + gas top-up booked'),

  ('Lakshmi Narayanan', '+91 90000 00012', 'Appointment', 21000.00, 'New',
   now() - interval '1 day', now() + interval '1 day',
   'Two split units, annual maintenance enquiry'),

  ('Techno Park Facility', '+91 90000 00013', 'Quote', 72000.00, 'Contacted',
   now() - interval '3 days', now() - interval '1 day',
   'Four-floor HVAC preventive maintenance quote'),

  ('Fatima Sheikh', '+91 90000 00014', 'Quote', 2600.00, 'New',
   now() - interval '2 days', now(),
   'Window AC installation quote'),

  ('Rajan Menon', '+91 90000 00015', 'Appointment', 48000.00, 'Awaiting confirmation',
   now() - interval '9 days', now() - interval '5 days',
   'Ducted AC install, waiting on advance payment'),

  ('Sharma Clinic (Dr. Priya)', '+91 90000 00016', 'Quote', 15500.00, 'Contacted',
   now() - interval '4 days', now() + interval '1 day',
   'OT AC service contract, revised quote sent');
