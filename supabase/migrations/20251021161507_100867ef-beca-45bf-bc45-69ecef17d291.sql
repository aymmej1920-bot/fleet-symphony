-- Drop all existing public policies
DROP POLICY IF EXISTS "Allow public read access on vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public insert access on vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public update access on vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public delete access on vehicles" ON public.vehicles;

DROP POLICY IF EXISTS "Allow public read access on drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow public insert access on drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow public update access on drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow public delete access on drivers" ON public.drivers;

DROP POLICY IF EXISTS "Allow public read access on fuel_records" ON public.fuel_records;
DROP POLICY IF EXISTS "Allow public insert access on fuel_records" ON public.fuel_records;
DROP POLICY IF EXISTS "Allow public update access on fuel_records" ON public.fuel_records;
DROP POLICY IF EXISTS "Allow public delete access on fuel_records" ON public.fuel_records;

DROP POLICY IF EXISTS "Allow public read access on maintenance_records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Allow public insert access on maintenance_records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Allow public update access on maintenance_records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Allow public delete access on maintenance_records" ON public.maintenance_records;

DROP POLICY IF EXISTS "Allow public read access on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow public insert access on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow public update access on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow public delete access on documents" ON public.documents;

DROP POLICY IF EXISTS "Allow public read access on tours" ON public.tours;
DROP POLICY IF EXISTS "Allow public insert access on tours" ON public.tours;
DROP POLICY IF EXISTS "Allow public update access on tours" ON public.tours;
DROP POLICY IF EXISTS "Allow public delete access on tours" ON public.tours;

DROP POLICY IF EXISTS "Allow public read access on inspections" ON public.inspections;
DROP POLICY IF EXISTS "Allow public insert access on inspections" ON public.inspections;
DROP POLICY IF EXISTS "Allow public update access on inspections" ON public.inspections;
DROP POLICY IF EXISTS "Allow public delete access on inspections" ON public.inspections;

-- Create new authenticated-only policies
-- Vehicles
CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert vehicles" ON public.vehicles
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicles" ON public.vehicles
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete vehicles" ON public.vehicles
FOR DELETE TO authenticated
USING (true);

-- Drivers
CREATE POLICY "Authenticated users can view drivers" ON public.drivers
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert drivers" ON public.drivers
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update drivers" ON public.drivers
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete drivers" ON public.drivers
FOR DELETE TO authenticated
USING (true);

-- Fuel Records
CREATE POLICY "Authenticated users can view fuel_records" ON public.fuel_records
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert fuel_records" ON public.fuel_records
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update fuel_records" ON public.fuel_records
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete fuel_records" ON public.fuel_records
FOR DELETE TO authenticated
USING (true);

-- Maintenance Records
CREATE POLICY "Authenticated users can view maintenance_records" ON public.maintenance_records
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert maintenance_records" ON public.maintenance_records
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update maintenance_records" ON public.maintenance_records
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete maintenance_records" ON public.maintenance_records
FOR DELETE TO authenticated
USING (true);

-- Documents
CREATE POLICY "Authenticated users can view documents" ON public.documents
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert documents" ON public.documents
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents" ON public.documents
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete documents" ON public.documents
FOR DELETE TO authenticated
USING (true);

-- Tours
CREATE POLICY "Authenticated users can view tours" ON public.tours
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert tours" ON public.tours
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update tours" ON public.tours
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete tours" ON public.tours
FOR DELETE TO authenticated
USING (true);

-- Inspections
CREATE POLICY "Authenticated users can view inspections" ON public.inspections
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert inspections" ON public.inspections
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update inspections" ON public.inspections
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete inspections" ON public.inspections
FOR DELETE TO authenticated
USING (true);