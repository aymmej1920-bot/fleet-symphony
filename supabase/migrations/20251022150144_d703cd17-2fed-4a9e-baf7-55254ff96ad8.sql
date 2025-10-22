-- Add user_id columns as nullable first to handle existing data
ALTER TABLE public.vehicles 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.drivers 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.fuel_records 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.maintenance_records 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.documents 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tours 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.inspections 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can delete vehicles" ON public.vehicles;

DROP POLICY IF EXISTS "Authenticated users can view drivers" ON public.drivers;
DROP POLICY IF EXISTS "Authenticated users can insert drivers" ON public.drivers;
DROP POLICY IF EXISTS "Authenticated users can update drivers" ON public.drivers;
DROP POLICY IF EXISTS "Authenticated users can delete drivers" ON public.drivers;

DROP POLICY IF EXISTS "Authenticated users can view fuel_records" ON public.fuel_records;
DROP POLICY IF EXISTS "Authenticated users can insert fuel_records" ON public.fuel_records;
DROP POLICY IF EXISTS "Authenticated users can update fuel_records" ON public.fuel_records;
DROP POLICY IF EXISTS "Authenticated users can delete fuel_records" ON public.fuel_records;

DROP POLICY IF EXISTS "Authenticated users can view maintenance_records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Authenticated users can insert maintenance_records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Authenticated users can update maintenance_records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Authenticated users can delete maintenance_records" ON public.maintenance_records;

DROP POLICY IF EXISTS "Authenticated users can view documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can insert documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON public.documents;

DROP POLICY IF EXISTS "Authenticated users can view tours" ON public.tours;
DROP POLICY IF EXISTS "Authenticated users can insert tours" ON public.tours;
DROP POLICY IF EXISTS "Authenticated users can update tours" ON public.tours;
DROP POLICY IF EXISTS "Authenticated users can delete tours" ON public.tours;

DROP POLICY IF EXISTS "Authenticated users can view inspections" ON public.inspections;
DROP POLICY IF EXISTS "Authenticated users can insert inspections" ON public.inspections;
DROP POLICY IF EXISTS "Authenticated users can update inspections" ON public.inspections;
DROP POLICY IF EXISTS "Authenticated users can delete inspections" ON public.inspections;

-- Create user-scoped RLS policies for vehicles
CREATE POLICY "Users can view own vehicles" 
ON public.vehicles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own vehicles" 
ON public.vehicles 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vehicles" 
ON public.vehicles 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own vehicles" 
ON public.vehicles 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create user-scoped RLS policies for drivers
CREATE POLICY "Users can view own drivers" 
ON public.drivers 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own drivers" 
ON public.drivers 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own drivers" 
ON public.drivers 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own drivers" 
ON public.drivers 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create user-scoped RLS policies for fuel_records
CREATE POLICY "Users can view own fuel_records" 
ON public.fuel_records 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own fuel_records" 
ON public.fuel_records 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own fuel_records" 
ON public.fuel_records 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own fuel_records" 
ON public.fuel_records 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create user-scoped RLS policies for maintenance_records
CREATE POLICY "Users can view own maintenance_records" 
ON public.maintenance_records 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own maintenance_records" 
ON public.maintenance_records 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own maintenance_records" 
ON public.maintenance_records 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own maintenance_records" 
ON public.maintenance_records 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create user-scoped RLS policies for documents
CREATE POLICY "Users can view own documents" 
ON public.documents 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own documents" 
ON public.documents 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents" 
ON public.documents 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own documents" 
ON public.documents 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create user-scoped RLS policies for tours
CREATE POLICY "Users can view own tours" 
ON public.tours 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own tours" 
ON public.tours 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tours" 
ON public.tours 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own tours" 
ON public.tours 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create user-scoped RLS policies for inspections
CREATE POLICY "Users can view own inspections" 
ON public.inspections 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert own inspections" 
ON public.inspections 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own inspections" 
ON public.inspections 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own inspections" 
ON public.inspections 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() OR user_id IS NULL);