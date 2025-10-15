-- Create tables for fleet management

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  plate TEXT UNIQUE NOT NULL,
  year INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  mileage INTEGER DEFAULT 0,
  fuel_level INTEGER DEFAULT 100,
  next_maintenance_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  license_number TEXT UNIQUE NOT NULL,
  license_expiry DATE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on-route', 'off-duty')),
  assigned_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  total_trips INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Maintenance records table
CREATE TABLE public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  mileage INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fuel records table
CREATE TABLE public.fuel_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  cost DECIMAL(10,2) NOT NULL,
  liters DECIMAL(10,2) NOT NULL,
  mileage INTEGER NOT NULL,
  consumption DECIMAL(5,2),
  station TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('registration', 'insurance', 'inspection', 'license')),
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expiring', 'expired')),
  document_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tours table
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed')),
  total_stops INTEGER DEFAULT 0,
  completed_stops INTEGER DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  distance_km DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inspections table
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  inspector TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'warning', 'failed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  issues_found INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for now, can be restricted later with auth)
CREATE POLICY "Allow public read access on vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on vehicles" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on vehicles" ON public.vehicles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on vehicles" ON public.vehicles FOR DELETE USING (true);

CREATE POLICY "Allow public read access on drivers" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on drivers" ON public.drivers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on drivers" ON public.drivers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on drivers" ON public.drivers FOR DELETE USING (true);

CREATE POLICY "Allow public read access on maintenance_records" ON public.maintenance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on maintenance_records" ON public.maintenance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on maintenance_records" ON public.maintenance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on maintenance_records" ON public.maintenance_records FOR DELETE USING (true);

CREATE POLICY "Allow public read access on fuel_records" ON public.fuel_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on fuel_records" ON public.fuel_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on fuel_records" ON public.fuel_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on fuel_records" ON public.fuel_records FOR DELETE USING (true);

CREATE POLICY "Allow public read access on documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on documents" ON public.documents FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on documents" ON public.documents FOR DELETE USING (true);

CREATE POLICY "Allow public read access on tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on tours" ON public.tours FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on tours" ON public.tours FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on tours" ON public.tours FOR DELETE USING (true);

CREATE POLICY "Allow public read access on inspections" ON public.inspections FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on inspections" ON public.inspections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on inspections" ON public.inspections FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on inspections" ON public.inspections FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON public.maintenance_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fuel_records_updated_at BEFORE UPDATE ON public.fuel_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON public.tours
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON public.inspections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.vehicles (brand, model, plate, year, status, mileage, fuel_level, next_maintenance_date)
VALUES 
  ('Renault', 'Master', 'AB-123-CD', 2020, 'active', 48500, 75, '2025-11-15'),
  ('Peugeot', 'Partner', 'EF-456-GH', 2021, 'active', 32000, 90, '2025-11-22'),
  ('Citroën', 'Berlingo', 'IJ-789-KL', 2019, 'maintenance', 67500, 60, NULL),
  ('Ford', 'Transit', 'MN-012-OP', 2022, 'active', 25000, 85, '2025-12-01'),
  ('Mercedes', 'Sprinter', 'QR-345-ST', 2020, 'active', 54000, 70, '2025-11-28');

INSERT INTO public.drivers (name, email, phone, license_number, license_expiry, status, total_trips, rating)
VALUES
  ('Jean Dupont', 'jean.dupont@email.com', '+33 6 12 34 56 78', 'DL123456', '2026-05-15', 'on-route', 342, 4.8),
  ('Marie Martin', 'marie.martin@email.com', '+33 6 23 45 67 89', 'DL234567', '2027-03-22', 'available', 287, 4.9),
  ('Pierre Dubois', 'pierre.dubois@email.com', '+33 6 34 56 78 90', 'DL345678', '2025-12-10', 'available', 156, 4.6),
  ('Sophie Bernard', 'sophie.bernard@email.com', '+33 6 45 67 89 01', 'DL456789', '2026-08-30', 'off-duty', 423, 4.7);

INSERT INTO public.maintenance_records (vehicle_id, type, date, mileage, status, priority, cost)
SELECT 
  v.id,
  'Révision',
  '2025-11-15'::date,
  50000,
  'scheduled',
  'medium',
  NULL
FROM public.vehicles v WHERE v.plate = 'AB-123-CD';

INSERT INTO public.maintenance_records (vehicle_id, type, date, mileage, status, priority, cost)
SELECT 
  v.id,
  'Contrôle technique',
  CURRENT_DATE,
  68000,
  'in-progress',
  'high',
  NULL
FROM public.vehicles v WHERE v.plate = 'IJ-789-KL';