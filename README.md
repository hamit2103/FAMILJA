# Familja PWA — Supabase Free

Aplikacioni Familja tani përdor **Supabase Free** për:
- hyrjen me kod (Supabase Auth)
- ruajtjen private të fotove/videove (Supabase Storage)
- listën e materialeve (Postgres)
- përditësime realtime në telefonat e tjerë

## Pse u ndryshua
Firebase Storage kërkonte Blaze/billing. Ky version nuk ka nevojë për Firebase Storage.

## Kufijtë falas aktualë të Supabase
- 1 GB file storage
- 5 GB egress
- maksimum 50 MB për një skedar
- 2 projekte aktive falas

Kur tejkalohen kufijtë e planit Free, shërbimi kufizohet derisa të ulësh përdorimin ose të kalosh vetë në plan me pagesë; nuk kalon vetë në Pro.

## Setup
1. Krijo projekt falas në Supabase.
2. Te Authentication krijo:
   - familja@familja.local
   - admin@familja.local
3. Te SQL Editor ekzekuto të gjithë skedarin `supabase/setup.sql`.
4. Te Project Settings kopjo:
   - Project URL
   - anon/public key
5. Vendosi te `app-config.js`.

Mos vendos kurrë service_role key në GitHub ose në aplikacion.
